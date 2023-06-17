import { PrismaClient } from '@prisma/client'
import { CalendarService } from './calendarService'
import { TimerService } from './timerService'
import nodemailer from 'nodemailer'
import webpush from 'web-push'

const db = new PrismaClient()
const calendarService = new CalendarService(db)
const timerService = new TimerService(db)

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nlskoolworkshop@gmail.com',
        pass: 'Avans55!'
    }
})

const vapidKeys = {
    publicKey:
        'BPAm8av-4R6wngbi4_9ahOI8bEtKCFq6iBY-dc5l5G23Z4DNd5GxMiOUvBt3BUf-lWsD2z2SWW4QdMOM32jrdqc',
    privateKey: '0lkU4LU67rE3njkicMeXF81_OJDNS-gaAAl8QO6zAEI',
};
webpush.setVapidDetails(
    'mailto:your-email@example.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

const pushSubscription = {
    endpoint: '.....',
    keys: {
        auth: '.....',
        p256dh: '.....'
    }
}

let lastSent = null;

setInterval(async () => {
    const now = new Date();
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);

    const calendar = await calendarService.fetchCalendar(startDate, endDate);
    const requiredStock = await calendarService.calculate(calendar);
    const productsToOrder = await timerService.fetchProductsToOrder(requiredStock);

    // Check if stock is low and if an email hasn't been sent in the last 24 hours
    if (productsToOrder.length > 0 && (!lastSent || (now - lastSent) >= (1000 * 60 * 60 * 24))) {
        let productsToOrderMessage = productsToOrder.map(product => {
            return `Product ID: ${product.id}, Order Quantity: ${product.orderQuantity}`
        }).join('\n');

        const mailOptions = {
            from: 'nlskoolworkshop@gmail.com',
            to: 'info@skoolworkshop.nl',
            subject: 'Products to Order',
            text: productsToOrderMessage
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        });

        let message = JSON.stringify({
            title: 'Products to Order',
            body: productsToOrderMessage
        });

        webpush.sendNotification(pushSubscription, message);

        // Update the lastSent time to now
        lastSent = now;
    }

}, 1000 * 60 * 60)


