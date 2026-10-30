export const authConfig = {
  assets: {
    backgroundImage: "/images/auth/signup.svg",
    logo: "/logo/Group%20151.svg",
  },
  //auth-signup
  signup: {
    title: "Create your account",
    description:
      "Set up your account to manage your bakery operations with ease",
    googleButtonLabel: "Continue with Google",
    googleUnavailableMessage: "Google sign-up is not connected yet.",
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
    continueButtonLabel: "Continue",
    loginPrompt: "I have an account?",
    loginLinkLabel: "Log in",
    loginHref: "/admin/login",
  },
  //auth-login
  login: {
    title: "Welcome Back",
    description: "Log in to manage orders, products, customers, and more",
    googleButtonLabel: "Continue with Google",
    googleUnavailableMessage: "Google sign-in is not connected yet.",
    forgotPasswordLabel: "Forgot password?",
    forgotPasswordHref: "/admin/forgot-password",
    signupPrompt: "Not have account?",
    signupLinkLabel: "Sign Up",
    signupHref: "/admin/signup",
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
      "Enter your email and we’ll send you a link to reset your password.",
    email: {
      label: "Email",
      placeholder: "Email",
    },
    sendCodeButtonLabel: "Send Code",
    unavailableMessage: "Password recovery is not connected yet.",
    backLabel: "Back",
    loginPrompt: "I have an account?",
    loginLinkLabel: "Log in",
    loginHref: "/admin/login",
    verificationHref: "/admin/verification-code",
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
    loginHref: "/admin/login",
    updatePasswordHref: "/admin/update-password",
  },
  //auth-update-password
  updatePassword: {
    title: "Update Password",
    description: "Log in to manage orders, products, customers, and more",
    email: {
      label: "Email",
      placeholder: "Email",
    },
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
    unavailableMessage: "Password updates are not connected yet.",
    loginPrompt: "I have an account?",
    loginLinkLabel: "Log in",
    loginHref: "/admin/login",
  },
} as const;
