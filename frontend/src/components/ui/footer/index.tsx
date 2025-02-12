export const Footer = () => {
    return (
        <footer className="bg-personalizedPurple text-black py-4 border-4 border-black">
            <div className="container mx-auto text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} Moneymgr Enterprise All rights reserved</p>
            </div>
        </footer>
    );
};
