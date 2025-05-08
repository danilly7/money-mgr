import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";
import { updateProfile, User } from "firebase/auth";
import { apiUsers } from "../../../api";
import Spinner from "../../ui/spinner";
import { UserDB } from "../interface-user";

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
const verifyUserInBackend = async (idToken: string, user: UserDB, navigate: ReturnType<typeof useNavigate>) => {
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

const Register = () => {
    const { userLoggedIn, loading } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Registration form submitted');

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        if (!isRegistering) {
            setIsRegistering(true);
            setErrorMessage("");
            try {
                const user = await createUserAndProfile(email, password, name);

                const idToken = await user.getIdToken();

                const userDB = convertToUserDB(user, name);
                await registerUserInBackend(userDB, idToken, name);
                await verifyUserInBackend(idToken, userDB, navigate);
            } catch (err: unknown) {
                console.error('Error during registration:', err);
                if (err instanceof Error) {
                    setErrorMessage(err.message);
                } else {
                    setErrorMessage("An unexpected error occurred.");
                }
            } finally {
                setIsRegistering(false);
            }
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (userLoggedIn) {
        return <Navigate to="/intro/welcome" replace />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen text-black text-center p-8">
            <div className="w-full max-w-md mx-4">
                <div className="p-4 mb-6 flex justify-center">
                    <Link to='/intro'>
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-8"
                        />
                    </Link>
                </div>
                <div className="p-8 bg-personalizedGreen border-4 border-black rounded-lg shadow-lg">
                    <h2 className="text-3xl font-semibold text-black mb-6">Register</h2>
                    {errorMessage && <p className="text-red-900 text-center mb-4">{errorMessage}</p>}
                    <form onSubmit={onSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-3 border-4 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-personalizedPink text-black"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border-4 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-personalizedPink text-black"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border-4 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-personalizedPink text-black"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-3 border-4 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-personalizedPink text-black"
                        />
                        <button
                            type="submit"
                            disabled={isRegistering}
                            className="w-full bg-personalizedPurple text-black font-semibold py-2 px-4 rounded-lg border-4 border-black hover:bg-personalizedPink disabled:opacity-50 transition-all duration-300"
                        >
                            {isRegistering ? "Registering..." : "Register"}
                        </button>
                    </form>
                    <p className="text-center mt-4">
                        Already have an account?{" "}
                        <Link to="/intro/login" className="text-white font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;