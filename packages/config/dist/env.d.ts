export declare const env: {
    NODE_ENV: "development" | "staging" | "production";
    DATABASE_URL: string;
    DATABASE_URL_UNPOOLED: string;
    APP_URL: string;
    WEB_URL: string;
    PLATFORM_URL: string;
    VERIFY_URL: string;
    REDIS_URL: string;
    JWT_SECRET?: string | undefined;
    JWT_REFRESH_SECRET?: string | undefined;
    UPSTASH_REDIS_URL?: string | undefined;
    UPSTASH_REDIS_TOKEN?: string | undefined;
    POLYGON_RPC_URL?: string | undefined;
    POLYGON_PRIVATE_KEY?: string | undefined;
    RESEND_API_KEY?: string | undefined;
    AWS_S3_BUCKET?: string | undefined;
    AWS_ACCESS_KEY_ID?: string | undefined;
    AWS_SECRET_ACCESS_KEY?: string | undefined;
    AWS_REGION?: string | undefined;
    SENTRY_DSN?: string | undefined;
};
export type Env = typeof env;
//# sourceMappingURL=env.d.ts.map