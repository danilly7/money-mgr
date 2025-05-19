export const getFirebaseErrorMessage = (errorCode: string, errorMessage?: string): string => {
  if (errorCode === "auth/password-does-not-meet-requirements" && errorMessage) {
    const missingRequirements: string[] = [];

    if (errorMessage.includes("lower case character")) {
      missingRequirements.push("• At least one lowercase letter");
    }
    if (errorMessage.includes("upper case character")) {
      missingRequirements.push("• At least one uppercase letter");
    }
    if (errorMessage.includes("numeric character")) {
      missingRequirements.push("• At least one number");
    }
    if (errorMessage.includes("non-alphanumeric character")) {
      missingRequirements.push("• At least one special character (e.g., !@#$%^&*)");
    }
    if (errorMessage.includes("8 characters")) {
      missingRequirements.push("• Minimum 8 characters");
    }

    if (missingRequirements.length > 0) {
      return "Password requirements not met:\n" + missingRequirements.join("\n");
    }

    return "The password does not meet security requirements.";
  }

  switch (errorCode) {
    case "auth/email-already-in-use":
      return "The email address is already in use.";
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/weak-password":
      return "The password is too weak.";
    default:
      return "An unexpected error occurred.";
  }
};