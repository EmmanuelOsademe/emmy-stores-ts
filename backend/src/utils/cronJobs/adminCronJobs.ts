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

        cron.schedule("* * * * *", async (): Promise<void> => {
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

                let htmlMessage = `<h3>Dear Admin,</h3><br>
                <h4>The following products are currently low on stock, as such, might require restocking</h4>
                <table style={{color: cornflowerBlue width: "150px" border: 1px solid}}>
                    <thead style={{width: "700px"}}>
                        <th style={{width: "150px", padding: "10px"}}>Product ID</th>
                        <th style={{width: "150px", padding: "10px"}}>Product Name</th>
                        <th style={{width: "150px", padding: "10px"}}>Current Stock</th>
                        <th style={{width: "150px", padding: "10px"}}>Trigger Quantity</th>
                    </thead>
                </table>`;

                let tableBody = '<tbody>';
                for(let prod of lowOnStockProducts){
                    tableBody += `<tr style={{width: "700px"}}>
                        <td style={{width: "150px", padding: "10px"}}>${prod._id}</td>
                        <td style={{width: "150px", padding: "10px"}}>${prod.name}</td>
                        <td style={{width: "150px", padding: "10px"}}>${prod.currentStock}</td>
                        <td style={{width: "150px", padding: "10px"}}>${prod.triggerQuantity}</td>
                    </tr>`
                }

                tableBody += '</tbody>';

                htmlMessage += tableBody;

                let message = "Dear Admin, \n\nThe following products are low on stock and need to be re-stocked.\n\n";
                for(let prod of lowOnStockProducts){
                    message += `${prod.name}'s current stock is: ${prod.currentStock}, while the trigger quantity is ${prod.triggerQuantity}\n\n`;
                }
                
                await sendEmail({
                    from: "emmysshoppinghub@gmail.com",
                    to: "emma.osademe@gmail.com",
                    subject: "Low on Stock Products",
                    html: htmlMessage
                })
                log.info(message);
            } catch (e: any) {
                log.error(e);
            }
        })
    }
}

export default AdminCronJobs;