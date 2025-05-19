export const getFirebaseErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case "auth/email-already-in-use":
            return "Email is already in use.";
        case "auth/invalid-email":
            return "Invalid email address.";
        case "auth/weak-password":
            return "Password is too weak.";
        default:
            return "An unexpected error occurred.";
    }
};