import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";

const Register = () => {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

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
            try {
                await doCreateUserWithEmailAndPassword(email, password);
                navigate("/");
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setErrorMessage(err.message);
                } else {
                    setErrorMessage("An unexpected error occurred.");
                }
                setIsRegistering(false);
            }
        }
    };

    if (userLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen text-black text-center p-8">
            <div className="w-full max-w-md mx-4">
                <div className="p-4 mb-6 flex justify-center">
                <Link to='/welcome'>
                        <img
                            src="/public/logo.png"
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
                        <Link to="/welcome/login" className="text-white font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;