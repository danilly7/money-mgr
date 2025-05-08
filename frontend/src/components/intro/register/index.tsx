import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";
import { updateProfile } from "firebase/auth";
import { apiUsers } from "../../../api";
import Spinner from "../../ui/spinner";

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

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        if (!isRegistering) {
            setIsRegistering(true);
            setErrorMessage("");
            try {
                const userCredential = await doCreateUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                await updateProfile(user, { //aquí pillo la info del nombre para imprimirla en el comp User
                    displayName: name,
                });

                //ahora pediremos el token para la API → sino me salta error 401, pq va más rápido que el token
                const idToken = await user.getIdToken();

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
                    throw new Error("Failed to update user data");
                }

                console.log("Esperando antes de navegar...");

                //Verificamos que el usuario este creado en la API
                let attempts = 0;
                let userCreated = false;
                const interval = setInterval(async () => {
                    const checkResponse = await fetch(apiUsers, {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    });

                    if (checkResponse.ok) {
                        const data = await checkResponse.json();
                        const found = data.users.find((u: { uid: string }) => u.uid === user.uid);
                        if (found) {
                            userCreated = true;
                            clearInterval(interval); //detener el intervalo cuando se confirme
                            navigate("/intro/welcome");
                        }
                    }

                    attempts++;
                    if (attempts >= 5 || userCreated) {
                        clearInterval(interval); //detener el intervalo después de 5 intentos
                        if (!userCreated) {
                            throw new Error("User was created in Firebase but not found in backend");
                        }
                        navigate("/intro/welcome"); //redirigir después de la verificación
                    }
                }, 1000); //revisar cada 1 segundo
            } catch (err: unknown) {
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

    //redirige si el usuario ya está logueado (por ejemplo, si entra manualmente a /intro/register)
    //caso especial, pq la redirección ya se hace arriba.
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