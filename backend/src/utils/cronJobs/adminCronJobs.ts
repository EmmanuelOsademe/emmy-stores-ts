import ProductModel from '@/resources/product/product.model';
import cron from 'node-cron';
import log from '../logger';
import sendEmail from '../mailer';
import { SendMailOptions } from 'nodemailer';
import { TemplateOptions } from 'nodemailer-express-handlebars';


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
                                _id: false,
                                "Product Name": "$name",
                                "Product ID": "$_id",
                                "Remaining Stock": "$currentStock",
                                "Flagging Quantity": "$triggerQuantity", 
                                isLowOnStock: {$lte: ["$currentStock", "$triggerQuantity"]}
                            }
                        },
                        {
                            $match: {
                                isLowOnStock: true
                            }
                        },
                        {
                            $unset: "isLowOnStock"
                        }
                    ]
                )
                
                
                const mailOptions: SendMailOptions & TemplateOptions = {
                    from: "emmysshoppinghub@gmail.com",
                    to: "emma.osademe@gmail.com",
                    subject: "Low on Stock Products",
                    template: 'lowOnStock',
                    context: {
                        name: "Admin",
                        lowOnStockProducts: lowOnStockProducts
                    }
                }
                
                await sendEmail(mailOptions)
                log.info("Notification sent");
            } catch (e: any) {
                log.error(e);
            }
        })
    }
}

export default AdminCronJobs;