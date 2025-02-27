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
        <div className="flex flex-col items-center justify-center h-screen mb-2">
            <UserIcon className="w-9 h-9 text-personalizedPurple hover:text-personalizedOrange"/>
            <h1 className="text-4xl font-bold">User</h1>
            <div className="m-8 text-center text-lg">
                <p><strong>Email:</strong> {currentUser?.email}</p>
                <p><strong>Name:</strong> {currentUser?.displayName}</p>

            </div>
                <button
                    onClick={handleLogout}
                    className="mt-4 px-8 py-4 text-xl font-semibold bg-personalizedPurple text-white border-4 border-black rounded-lg transition-all duration-300 hover:text-black hover:bg-personalizedOrange"
                >
                    Logout
                </button>
        </div>
    );
};

export default User;