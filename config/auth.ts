export const authConfig = {
  assets: {
    backgroundImage: "/images/auth/signup.svg",
    logo: "/logo/Group%20151.svg",
  },
  //auth-signup
  signup: {
    title: "Request Client Access",
    description:
      "Create a client account request. Website access requires Super Admin approval.",
    googleButtonLabel: "Request access with Google",
    accountUnavailableMessage: "Account creation is not connected yet.",
    fields: {
      name: {
        label: "Name",
        placeholder: "Name",
      },
      email: {
        label: "Email",
        placeholder: "Email",
      },
      password: {
        label: "Password",
        placeholder: "Password",
      },
    },
    passwordVisibility: {
      show: "Show password",
      hide: "Hide password",
    },
    continueButtonLabel: "Submit access request",
    loginPrompt: "I have an account?",
    loginLinkLabel: "Log in",
    loginHref: "/login",
  },
  //auth-login
  login: {
    title: "Welcome Back",
    description: "Log in to manage orders, products, customers, and more",
    googleButtonLabel: "Continue with Google",
    forgotPasswordLabel: "Forgot password?",
    forgotPasswordHref: "/forgot-password",
    signupPrompt: "Need client access?",
    signupLinkLabel: "Request access",
    signupHref: "/signup",
    email: {
      label: "Email",
      placeholder: "Email",
    },
    password: {
      label: "Password",
      placeholder: "Password",
    },
    continueButtonLabel: "Continue",
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
