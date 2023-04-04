import OrderModel from '@/resources/order/order.model';
import PurchaseModel from '@/resources/purchase/purchase.model';
import {SalesPurchasesI, MonthlyProductsSales, ProductSales} from '@/resources/admin/admin.interface';

class AdminService {
    private order = OrderModel;
    private purchase = PurchaseModel;

    public async getSalesPurchases(): Promise<SalesPurchasesI[] | Error> {
        try {

            const result: SalesPurchasesI[] = new Array();

            const date = new Date();
            const dateArray: Date[] = new Array();
            for(let i = 0; i < 12; i++){
                dateArray.unshift(new Date(date.setMonth(date.getMonth() - 1)));
            }
            dateArray.push(new Date());
            
            for(let i = 1; i <= dateArray.length; i++){
                const sales = await this.order.aggregate(
                    [
                        {
                            $match: {
                                createdAt: {$gte: dateArray[i - 1], $lt: dateArray[i]}
                            },
                        },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                                totalSales: {$sum: "$subtotal"}
                            }
                        }
                    ]
                );

                const purchases = await this.purchase.aggregate(
                    [
                        {
                            $match: {
                                createdAt: {$gte: dateArray[i - 1], $lt: dateArray[i]}
                            },
                        },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                                totalCost: {$sum: "$totalCost"}
                            }
                        }
                    ]
                )
                
                const revenue = (isNaN(sales[0]?.totalSales) ? 0 : sales[0]?.totalSales) - (isNaN(purchases[0]?.totalCost) ? 0 : purchases[0]?.totalCost);
                
                if(i < dateArray.length){
                    result.push({
                        date: `${dateArray[i].getMonth() + 1}-${dateArray[i].getFullYear()}`,
                        sales: (isNaN(sales[0]?.totalSales) ? 0 : sales[0]?.totalSales),
                        purchases: (isNaN(purchases[0]?.totalCost) ? 0 : purchases[0]?.totalCost),
                        revenue: revenue
                    })
                }
            }
            return result;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getMonthlySales(): Promise<MonthlyProductsSales[] | Error>{
        try {
            const result: MonthlyProductsSales[] = new Array();

            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();

            const date = new Date(year, month+1, 1);
            
            const dateArray: Date[] = new Array();
            for(let i = 0; i <= 12; i++){
                dateArray.unshift(new Date(date.setMonth(date.getMonth() - 1)));
            }
            dateArray.push(new Date(year, month+1, 1));

            for(let i = dateArray.length -2; i >= 1; i--){
                
                const sales: ProductSales[] = await this.order.aggregate(
                    [
                        {
                            $unwind: {
                                path: "$orderItems"
                            }
                        },
                        {
                            $match: {
                                createdAt: {$gt: dateArray[i - 1], $lte: dateArray[i]}
                            },
                        },
                        
                        {
                            $group: {
                                _id: "$orderItems.productName",
                                quantitySold: {$sum: "$orderItems.quantity"},
                                valueOfSales: {$sum: {$multiply: ["$orderItems.quantity", "$orderItems.price", 0.01]}}
                            }
                        },
                        {
                            $sort: {
                                valueOfSales: -1,
                                quantitySold: -1
                            }
                        },
                        {
                            $limit: 20
                        }
                    ]
                );

                result.push({
                    month: dateArray[i],
                    data: sales
                })
                
            }
            return result;
        } catch (e: any) {
            throw new Error(e.message);
        }

    }
}

export default AdminService;