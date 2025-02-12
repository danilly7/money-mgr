import { useState } from "react";
import { Link, NavLink } from "react-router-dom"
import { UserIcon, BurguerIcon, CancelIcon } from "../icons";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (

        <div className="flex flex-row items-center justify-between p-4 bg-gray-800 relative">
            <div className="flex flex-row items-center space-x-4">
                <Link to='/'>
                    <img src="/favicon.ico" alt="Logo" className="h-8" />
                </Link>
                <h1 className=" text-white text-2xl font-semibold">
                    <Link to='/'>Money mgr</Link>
                </h1>
            </div>

            <button
                className="sm:hidden text-white text-3xl"
                onClick={toggleMenu}
            >
                {isMenuOpen ? (
                    <CancelIcon className="text-personalizedPurple" />
                ) : (
                    <BurguerIcon className="text-personalizedPurple" />
                )}

            </button>

            <nav className="hidden sm:flex sm:flex-row items-end">
                <ul className="flex flex-row space-x-8 text-white text-xl">
                    <li>
                        <NavLink
                            to='/'
                            className={({ isActive }) => isActive ? 'font-semibold pointer-events-none' : undefined}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/accounts'
                            className={({ isActive }) => isActive ? 'font-semibold pointer-events-none' : undefined}
                        >
                            Accounts
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/categories'
                            className={({ isActive }) => isActive ? 'font-semibold pointer-events-none' : undefined}
                        >
                            Categories
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/welcome'
                            className={({ isActive }) => isActive ? 'font-semibold pointer-events-none' : undefined}
                        >
                            <UserIcon className="text-personalizedPurple" />
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <nav className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-full left-0 w-full bg-gray-700 rounded-b-lg z-20`}>
                <ul className="flex flex-col items-center space-y-4 text-white text-xl py-4">
                    <li>
                        <NavLink
                            to='/'
                            className={({ isActive }) => isActive ? 'font-semibold' : undefined}
                            onClick={handleLinkClick}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/accounts'
                            className={({ isActive }) => isActive ? 'font-semibold' : undefined}
                            onClick={handleLinkClick}
                        >
                            Accounts
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/categories'
                            className={({ isActive }) => isActive ? 'font-semibold' : undefined}
                            onClick={handleLinkClick}
                        >
                            Categories
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/welcome'
                            className={({ isActive }) => isActive ? 'font-semibold' : undefined}
                            onClick={handleLinkClick}
                        >
                            <UserIcon />
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    )
};