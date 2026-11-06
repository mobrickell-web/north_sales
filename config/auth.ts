export const authConfig = {
  assets: {
    backgroundImage: "/images/auth/signup.svg",
    logo: "/logo/Group%20151.svg",
  },
  //auth-login
  login: {
    title: "Authorized Access",
    description:
      "Please select your access type and enter your login credentials.",
    categoryLabel: "Access Type",
    categories: [
      { value: "CLIENT", label: "Client" },
      { value: "ACCOUNT_EXECUTIVE", label: "Account Executive" },
      {
        value: "IMPLEMENTATION_SPECIALIST",
        label: "Implementation Specialist",
      },
      { value: "FRACTIONAL_VP", label: "Fractional VP" },
      { value: "REGIONAL_SALES_MANAGER", label: "Regional Sales Manager" },
      { value: "MASTER_ADMIN", label: "Master Admin" },
      { value: "OTHER", label: "Other" },
    ],
    googleButtonLabel: "Continue with Google",
    forgotPasswordLabel: "Forgot password?",
    forgotPasswordHref: "/forgot-password",
    email: {
      label: "Email",
      placeholder: "Email",
    },
    password: {
      label: "Password",
      placeholder: "Password",
    },
    continueButtonLabel: "Log In",
    submittingLabel: "Signing in…",
    emptyFieldsMessage: "Please enter your email and password.",
    unauthorizedMessage: "This account does not have dashboard access.",
  },
  //auth-forgot-password
  forgotPassword: {
    title: "Forgot Password",
    description:
      "Enter your email and we’ll send you a verification code to reset your password.",
    email: {
      label: "Email",
      placeholder: "Email",
    },
    sendCodeButtonLabel: "Send Code",
    backLabel: "Back",
    loginPrompt: "I have an account?",
    loginLinkLabel: "Log in",
    loginHref: "/login",
    verificationHref: "/verification-code",
  },
  //auth-verification-code
  verificationCode: {
    title: "Verification Code",
    description:
      "We sent a verification code to your email address. Please enter the code below.",
    codeLabel: "Verification code digit",
    verifyButtonLabel: "Verify",
    resendPrompt: "Didn’t receive code?",
    resendButtonLabel: "Resend Code",
    resendUnavailableMessage: "Code resend is not connected yet.",
    unavailableMessage: "Code verification is not connected yet.",
    backToLoginLabel: "Back to login",
    loginHref: "/login",
    updatePasswordHref: "/update-password",
  },
  //auth-update-password
  updatePassword: {
    title: "Update Password",
    description: "Enter your new password to complete the reset.",
    password: {
      label: "New password",
      placeholder: "New password",
    },
    confirmPassword: {
      label: "Confirm new password",
      placeholder: "Confirm new password",
    },
    passwordVisibility: {
      show: "Show password",
      hide: "Hide password",
    },
    continueButtonLabel: "Continue",
    passwordMismatchMessage: "Passwords do not match.",
    loginPrompt: "I have an account?",
    loginLinkLabel: "Log in",
    loginHref: "/login",
  },
} as const;
