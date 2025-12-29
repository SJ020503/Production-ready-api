const redisClient = require('../utils/redisClient');

const tokenBucketLimiter = ({ capacity, refillRate }) => {
  return async (req, res, next) => {
    try {
      const identifier = req.user?.id || req.ip;
      const key = `rate:${identifier}`;

      const now = Date.now();

      const data = await redisClient.hGetAll(key);

      let tokens = data.tokens ? parseFloat(data.tokens) : capacity;
      let lastRefill = data.lastRefill ? parseInt(data.lastRefill) : now;

      const elapsedSeconds = (now - lastRefill) / 1000;
      const refill = elapsedSeconds * refillRate;

      tokens = Math.min(capacity, tokens + refill);

      if (tokens < 1) {
        return res.status(429).json({
          status: 'fail',
          message: 'Too many requests. Please try again later.',
        });
      }

      tokens -= 1;

      await redisClient.hSet(key, {
        tokens: tokens,
        lastRefill: now,
      });

      await redisClient.expire(key, Math.ceil(capacity / refillRate));

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = tokenBucketLimiter;
