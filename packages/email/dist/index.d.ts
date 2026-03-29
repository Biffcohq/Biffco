import React from 'react';
export * from './templates/InvitationEmail';
export * from './templates/WelcomeEmail';
export * from './templates/HoldAlertEmail';
export * from './templates/DTEExpiryEmail';
export declare function sendEmail<T>({ to, subject, component, props }: {
    to: string;
    subject: string;
    component: React.ComponentType<T>;
    props: T;
}): Promise<({
    error: import("resend").ErrorResponse;
    data: null;
} & {
    headers: Record<string, string> | null;
}) | ({
    data: import("resend").CreateEmailResponseSuccess;
    error: null;
} & {
    headers: Record<string, string> | null;
}) | {
    id: string;
}>;
//# sourceMappingURL=index.d.ts.map