import ProductModel from '@/resources/product/product.model';
import cron from 'node-cron';
import log from '../logger';
import sendEmail from '../mailer';


class AdminCronJobs {
    private ProductModel = ProductModel;

    constructor() {
        this.initialiseCronJobs();
    }

    private initialiseCronJobs(): void {
        this.outOfStockNotifier();
    }

    private outOfStockNotifier =  (): void => {

        cron.schedule("1 20 * * *", async (): Promise<void> => {
            try {
                const lowOnStockProducts = await this.ProductModel.aggregate(
                    [
                        {
                            $project: {
                                currentStock: 1,
                                triggerQuantity: 1,
                                name: 1, 
                                isLowOnStock: {$lte: ["$currentStock", "$triggerQuantity"]}
                            }
                        },
                        {
                            $match: {
                                isLowOnStock: true
                            }
                        }
                    ]
                )
                console.log(lowOnStockProducts);

                let message = "Dear Admin, \n\nThe following products are low on stock and need to be re-stocked.\n\n";
                for(let prod of lowOnStockProducts){
                    message += `${prod.name}'s current stock is: ${prod.currentStock}, while the trigger quantity is ${prod.triggerQuantity}\n\n`;
                }
                
                await sendEmail({
                    from: "emmysshoppinghub@gmail.com",
                    to: "emma.osademe@gmail.com",
                    subject: "Low on Stock Products",
                    text: message
                })
                log.info(message);
            } catch (e: any) {
                log.error(e);
            }
        })
    }
}

export default AdminCronJobs;