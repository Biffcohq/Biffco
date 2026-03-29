/* global console */
/* eslint-disable no-undef, no-console */
import React from 'react';
import { Resend } from 'resend';
import { env } from '@biffco/config';

const resendReady = !!env.RESEND_API_KEY;
const resend = resendReady ? new Resend(env.RESEND_API_KEY) : null;

export * from './templates/InvitationEmail';
export * from './templates/WelcomeEmail';

export async function sendEmail<T>({
  to, subject, component, props
}: {
  to: string;
  subject: string;
  component: React.ComponentType<T>;
  props: T;
}) {
  const { render } = await import('@react-email/render');
  const html = await render(React.createElement(component as React.ElementType, props as Record<string, unknown>));
  
  if (!resendReady || !resend) {
    console.info("[Email Mock] sendEmail called but RESEND_API_KEY is missing. Mock sent:", { to, subject });
    return { id: "mock-id-1234" };
  }

  
  return resend.emails.send({
    from: "BIFFCO <noreply@biffco.co>",
    to,
    subject,
    html
  });
}
