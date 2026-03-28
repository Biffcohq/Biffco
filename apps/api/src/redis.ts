import Redis from 'ioredis'
import { env } from '@biffco/config'

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

redis.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("❌ Redis connection error:", err)
})
