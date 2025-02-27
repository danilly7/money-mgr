import { Link } from "react-router-dom";

const Welcome = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-black text-center p-8">
            <p className="text-5xl font-semibold mb-6">Haloooo</p>
            <p className="text-lg mb-12">Choose a pill:</p>
            <div className="flex space-x-8">
                <Link
                    to="/welcome/login"
                    className="px-8 py-4 text-xl font-semibold bg-personalizedPurple border-4 border-black rounded-lg transition-all duration-300 hover:bg-personalizedOrange hover:text-black"
                >
                    Login
                </Link>
                <Link
                    to="/welcome/register"
                    className="px-8 py-4 text-xl font-semibold bg-personalizedPink border-4 border-black rounded-lg transition-all duration-300 hover:bg-personalizedGreen hover:text-black"
                >
                    Register
                </Link>
            </div>
            <p className="mt-12 text-lg">Mi casa es su casa</p>
            <p className="text-lg">Welcome to <span className="text-personalizedPurple font-semibold">Moneymgr</span></p>
            <img
                src="/logo.png"
                alt="Logo"
                className="w-8 m-4"
            />
        </div>
    );
};

export default Welcome;