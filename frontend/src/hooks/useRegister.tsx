import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { updateProfile, User } from "firebase/auth";
import { apiUsers } from "../api";
import { UserDB } from "../components/intro/interface-user";
import { getFirebaseErrorMessage } from "../utils/firebaseErrors";
import { FirebaseError } from "firebase/app";

export const useRegister = () => {
    const navigate = useNavigate();

    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    //función para crear el usuario en Firebase y actualizar el perfil
    const createUserAndProfile = async (email: string, password: string, name: string) => {
        const userCredential = await doCreateUserWithEmailAndPassword(email, password);
        const user: User = userCredential.user;
        await updateProfile(user, { displayName: name });
        return user;
    };

    //función para convertir el User de Firebase al formato UserDB
    const convertToUserDB = (firebaseUser: User, name: string): UserDB => {
        return {
            id_user: 0, //esto se asignará en el backend automáticamente
            uid: firebaseUser.uid,
            name: name,
            email: firebaseUser.email || "", //asegúrate de manejar posibles valores null
        };
    };

    //función para registrar el usuario en el backend
    const registerUserInBackend = async (user: UserDB, idToken: string, name: string) => {
        const response = await fetch(apiUsers, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
                uid: user.uid,
                name: name,
                email: user.email,
            }),
        });

        if (!response.ok) {
            console.error('Failed to register user in backend:', await response.text());
            throw new Error("Failed to update user data");
        }
        console.log('User registered in backend successfully');
    };

    //función para verificar que el usuario esté registrado en el backend
    const verifyUserInBackend = async (idToken: string, user: UserDB) => {
        let attempts = 0;
        const maxAttempts = 5;
        let userCreated = false;

        const checkUser = async (): Promise<boolean> => {
            try {
                const checkResponse = await fetch(apiUsers, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                });

                if (checkResponse.ok) {
                    const data = await checkResponse.json();
                    const found = data.users.find((u: { uid: string }) => u.uid === user.uid);
                    if (found) {
                        return true;
                    }
                }
            } catch (error) {
                console.error("Error checking user in backend:", error);
            }
            return false;
        };

        while (attempts < maxAttempts && !userCreated) {
            userCreated = await checkUser();
            attempts++;
            if (!userCreated && attempts < maxAttempts) {
                console.log(`User not found yet, waiting... (attempt ${attempts})`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        if (!userCreated) {
            console.error('User not found in backend after max attempts');
            throw new Error("User was created in Firebase but not found in backend");
        }

        navigate("/intro/welcome");
    };

    // Función expuesta para hacer el registro
    const register = async (email: string, password: string, name: string, confirmPassword: string) => {
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        if (isRegistering) return;

        setIsRegistering(true);
        setErrorMessage("");

        try {
            const user = await createUserAndProfile(email, password, name);
            const idToken = await user.getIdToken();

            const userDB = convertToUserDB(user, name);
            await registerUserInBackend(userDB, idToken, name);
            await verifyUserInBackend(idToken, userDB);
        } catch (err: unknown) {
            console.error('Error during registration:', err);
            if (err instanceof FirebaseError) {
                const friendlyMessage = getFirebaseErrorMessage(err.code, err.message);
                setErrorMessage(friendlyMessage);
            } else if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setIsRegistering(false);
        }
    };

    return {
        isRegistering,
        errorMessage,
        register,
    };
};