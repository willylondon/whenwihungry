const errors: Record<string, string> = {
  credentials: "We couldn't sign you in. Check your email and password, and confirm your email if needed.",
  signup: "We couldn't create your account. Check your details or try signing in if you already have an account.",
  invalid: "Check the form and try again. Passwords must be 8–128 characters when creating or resetting an account.",
  email: "Enter a valid email address.",
  link: "This sign-in link is invalid or has expired. Try signing in or request another password reset.",
  reset: "We couldn't request a password reset. Please try again later.",
  password: "We couldn't update your password. Try a different password or request another reset link.",
  mismatch: "The passwords don't match. Please enter them again.",
  signout: "We couldn't sign you out. Please try again."
};

const notices: Record<string, string> = {
  "confirm-email": "Check your email for a confirmation link before signing in. If you already have an account, you can sign in below.",
  "reset-sent": "If an account exists for that email, you'll receive a password reset link. Open it in the same browser where you requested it.",
  "password-updated": "Your password has been updated."
};

export function authErrorMessage(code: unknown): string | null {
  return typeof code === "string" && Object.hasOwn(errors, code) ? errors[code] : null;
}

export function authNoticeMessage(code: unknown): string | null {
  return typeof code === "string" && Object.hasOwn(notices, code) ? notices[code] : null;
}
