import { UserIcon } from "../../components/ui/icons/UserIcon";
import { useAuth } from "../../context/auth-context";
import { useNavigate } from "react-router-dom";

const User = () => {
    const { currentUser, logout, userLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/welcome");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    if (!userLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">You are not logged in</h1>
                <p>Please log in to view your user details.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div
                className="group bg-white border-4 border-black rounded-lg shadow-lg px-6 py-8 text-center w-96"
            >

                <UserIcon
                    className="w-10 h-10 mx-auto mt-8 mb-4 
                           text-personalizedPurple 
                           transition-colors duration-300"
                />

                <h1 className="text-3xl font-bold mb-14 text-personalizedPurple">You is...</h1>

                <div className="text-lg mb-6">
                    <p><strong>Name:</strong> {currentUser?.displayName}</p>
                    <p><strong>Email:</strong> {currentUser?.email}</p>
                </div>

                <h2
                    className="text-3xl font-bold mt-8 
                    opacity-0 translate-y-2
                    transition-all duration-300
                    group-hover:opacity-100 group-hover:translate-y-0 text-personalizedOrange"
                >
                    ...smart,
                </h2>
                <h2
                    className="text-3xl font-bold mb-4
                    opacity-0 translate-y-2
                    transition-all duration-300 delay-75
                    group-hover:opacity-100 group-hover:translate-y-0 text-personalizedOrange"
                >
                    you is kind.
                </h2>

                <button
                    onClick={handleLogout}
                    className="px-6 py-3 my-8 text-lg font-semibold 
                           bg-personalizedPurple text-white 
                           border-4 border-black rounded-lg 
                           transition-all duration-300 
                           hover:text-black hover:bg-personalizedOrange"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default User;