import { useState } from "react";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { apiUsers } from "../api";
import { getFirebaseErrorMessage } from "../utils/firebaseErrors";
import { FirebaseError } from "firebase/app";

export const useLogin = () => {
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const signInWithEmail = async (email: string, password: string) => {
        setIsSigningIn(true);
        setErrorMessage("");
        try {
            const userCredential = await doSignInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            const response = await fetch(`${apiUsers}/${user.uid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to update user data");
            }

        } catch (err: unknown) {
            console.error('Error during login with email:', err);
            if (err instanceof FirebaseError) {
                setErrorMessage(getFirebaseErrorMessage(err.code, err.message));
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setIsSigningIn(false);
        }
    };

    const signInWithGoogle = async () => {
        setErrorMessage("");
        if (isSigningIn) return;

        try {
            //el popup debe lanzarse directamente desde la acción del usuario, sin setState antes
            const userCredential = await doSignInWithGoogle();
            const user = userCredential.user;

            setIsSigningIn(true);

            if (!user?.uid) {
                setErrorMessage("Invalid user ID");
                return;
            }

            const response = await fetch(`${apiUsers}/${user.uid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const userData = await response.json();
                console.log(userData);
            } else {
                // Crear usuario si no está en la BBDD
                const createResponse = await fetch(apiUsers, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: user.displayName,
                        email: user.email,
                        uid: user.uid,
                    }),
                });

                if (!createResponse.ok) {
                    throw new Error("Failed to create new user");
                }
            }
        } catch (err: unknown) {
            console.error('Error during login with Google:', err);
            if (err instanceof FirebaseError) {
                setErrorMessage(getFirebaseErrorMessage(err.code, err.message));
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setIsSigningIn(false);
        }
    };

    return {
        signInWithEmail,
        signInWithGoogle,
        isSigningIn,
        errorMessage,
    };
};
