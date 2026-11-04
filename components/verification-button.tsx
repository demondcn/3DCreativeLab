"use client";

import { EmailVerificationForm } from "@/components/email-verification-form";

export function VerificationButton({ email, callbackUrl }: { email: string; callbackUrl: string }) {
  return <EmailVerificationForm email={email} callbackUrl={callbackUrl} />;
}
