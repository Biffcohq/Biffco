import * as Sentry from '@sentry/node';
import { env } from '@biffco/config';

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1.0,
    beforeSend(event) {
      if (env.NODE_ENV === "development") {
        console.warn("[Sentry DEV Mock] Event captured: ", event.exception);
        return null; // NUNCA enviar a Sentry en dev local
      }
      return event;
    }
  });
} else {
  console.warn("[Sentry] No DSN provided. Error tracking disabled.");
}
