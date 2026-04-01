import { Queue, Worker } from 'bullmq';
export declare const expirationQueue: Queue<any, any, string, any, any, string>;
export declare const expirationWorker: Worker<any, any, string>;
export declare function scheduleExpirationCron(): Promise<void>;
//# sourceMappingURL=cron-worker.d.ts.map