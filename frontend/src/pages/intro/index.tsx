import { Link } from "react-router-dom";

const Intro = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-black text-center p-8">
            <p className="text-5xl font-semibold mb-6">Haloooo</p>
            <p className="text-lg mb-12">Choose a pill:</p>
            <div className="flex space-x-8">
                <Link
                    to="/intro/login"
                    className="px-8 py-4 text-xl font-semibold bg-personalizedPurple border-4 border-black rounded-lg transition-all duration-300 hover:bg-personalizedOrange hover:text-black"
                >
                    Login
                </Link>
                <Link
                    to="/intro/register"
                    className="px-8 py-4 text-xl font-semibold bg-personalizedPink border-4 border-black rounded-lg transition-all duration-300 hover:bg-personalizedGreen hover:text-black"
                >
                    Register
                </Link>
            </div>
            <p className="mt-12 text-xl">Welcome to <span className="text-personalizedPurple font-semibold">Moneymgr</span>🤗</p>
            <p className="mt-8 text-lg">Your personal budgeting buddy — let’s see just how much of a spendthrift you really are... 💸💸</p>
            <p className="mb-8 text-lg">But before we dive in, tell us who you are!</p>
            <img
                src="/logo.png"
                alt="Logo"
                className="w-8 m-4"
            />
        </div>
    );
};

export default Intro;