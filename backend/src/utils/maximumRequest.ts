import rateLimit from 'express-rate-limit';

export default rateLimit(
    {
        windowMs: 1000 * 60 * 60 * Number(process.env.WINDOW_LOG_INTERVAL_IN_HOURS),
        max: Number(process.env.MAXIMUM_REQUESTS),
        message: `You have exceeded the permissible ${process.env.MAXIMUM_WINDOW_REQUEST_COUNT} requests per ${process.env.WINDOW_LOG_INTERVAL_IN_HOURS}`,
        standardHeaders: true,
        legacyHeaders: false
    }
)