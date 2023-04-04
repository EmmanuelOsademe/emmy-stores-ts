export interface SalesPurchasesI {
    date: string;
    sales: number;
    purchases: number;
    revenue: number;
}

export interface MonthlyProductsSales {
    month: Date;
    data: ProductSales[]
}

export interface ProductSales {
    _id: string;
    quantitySold: number;
    valueOfSales: number;
}