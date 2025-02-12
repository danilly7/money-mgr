export const Footer = () => {
    return (
        <footer className="bg-gray-800 text-personalizedPurple py-4">
            <div className="container mx-auto text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} Moneymgr Enterprise All rights reserved.</p>
            </div>
        </footer>
    )
};