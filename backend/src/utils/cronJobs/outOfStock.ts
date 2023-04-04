import cron from 'node-cron';

const outOfStockNotifier = cron.schedule("* * * * *", (): void => {
    console.log("hello");
})

outOfStockNotifier.start();

