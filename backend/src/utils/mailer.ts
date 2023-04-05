import nodemailer, {SendMailOptions} from 'nodemailer';
import log from '@/utils/logger';
import hbs, {NodemailerExpressHandlebarsOptions} from 'nodemailer-express-handlebars'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true, 
    debug: true,
    auth: {
        user: 'emmyshoppinghub@gmail.com',
        pass: 'zbucjumcvlguwhaw'
    },
    tls: {
        rejectUnauthorized: true
    }
});

/*transporter.use('compile', hbs({
    viewEngine: 'express-handlebars',
    viewPath: './views/'
}))*/

export default async function sendEmail(payload: SendMailOptions){
    transporter.sendMail(payload, (err, info) => {
        if(err){
            log.error(err, "Error sending mail");
        }

        log.info(`Preview Url: ${payload.text}`);
    })
}