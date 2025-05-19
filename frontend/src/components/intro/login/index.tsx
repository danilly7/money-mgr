import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";
import Spinner from "../../ui/spinner";
import { useLogin } from "../../../hooks/useLogin";

const Login = () => {
    const { userLoggedIn, loading } = useAuth();
    const { signInWithEmail, signInWithGoogle, isSigningIn, errorMessage } = useLogin();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        signInWithEmail(email, password);
    };

    const handleGoogleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        signInWithGoogle();
    };

    if (loading) return <Spinner />;
    if (userLoggedIn) return <Navigate to="/" />;

    return (
        <div className="flex items-center justify-center min-h-screen text-black text-center p-8">
            <div className="w-full max-w-md  mx-4">
                <div className="p-4 mb-6 flex justify-center">
                    <Link to='/intro'>
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-8"
                        />
                    </Link>
                </div>
                <div className="p-8 bg-personalizedPurple border-4 border-black rounded-lg shadow-lg">
                    <h2 className="text-3xl font-semibold text-black mb-6">Login</h2>
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border-4 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-personalizedOrange text-black"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border-4 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-personalizedOrange text-black"
                        />
                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className="w-full bg-gray-800 text-personalizedOrange font-semibold py-2 px-4 rounded-lg border-4 border-black hover:bg-personalizedOrange hover:text-black disabled:opacity-50 transition-all duration-300"
                        >
                            {isSigningIn ? "Signing In..." : "Sign In"}
                        </button>
                    </form>
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isSigningIn}
                        className="w-full bg-gray-800 text-blue-400 font-semibold py-2 px-4 rounded-lg border-4 border-black hover:bg-blue-700 hover:border-black hover:text-white mt-4 disabled:opacity-50 transition-all duration-300"
                    >
                        Sign In with Google
                    </button>
                    <p className="text-red-900 text-left mt-4 whitespace-pre-line">{errorMessage}</p>
                    <p className="text-center mt-6">
                        Don't have an account?{" "}
                        <Link to="/intro/register" className="text-white font-semibold hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;