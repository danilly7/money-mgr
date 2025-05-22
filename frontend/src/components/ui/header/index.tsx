import { useState } from "react";
import { Link, NavLink } from "react-router-dom"
import { UserIcon } from "../icons/UserIcon";
import { BurguerIcon } from "../icons/BurguerIcon";
import { CancelIcon } from "../icons/CancelIcon";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="flex flex-row items-center justify-between p-4 bg-personalizedPurple relative border-t-4 border-b-4 border-black">
            <div className="flex flex-row items-center space-x-4">
                <Link to='/'>
                    <img src="/favicon.ico" alt="Logo" className="h-8" />
                </Link>
                <h1 className="text-white text-2xl">
                    <Link to='/'>Moneymgr</Link>
                </h1>
            </div>

            <button
                className="sm:hidden text-white text-3xl"
                onClick={toggleMenu}
            >
                {isMenuOpen ? (
                    <CancelIcon className="text-black" />
                ) : (
                    <BurguerIcon className="text-black" />
                )}
            </button>

            <nav className="hidden sm:flex sm:flex-row items-end">
                <ul className="flex flex-row space-x-8 text-white text-xl">
                    <li>
                        <NavLink
                            to='/'
                            end
                            className={({ isActive }) => isActive ? 'font-semibold pointer-events-none text-personalizedOrange' : undefined}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/accounts'
                            end
                            className={({ isActive }) => isActive ? 'font-semibold pointer-events-none text-personalizedOrange' : undefined}
                        >
                            Accounts
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/categories'
                            end
                            className={({ isActive }) => isActive ? 'font-semibold pointer-events-none text-personalizedOrange' : undefined}
                        >
                            Categories
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/user'
                            end
                            className={({ isActive }) => isActive ? 'font-semibold pointer-events-none text-personalizedOrange' : undefined}
                        >
                            <UserIcon />
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <nav className={`sm:hidden ${isMenuOpen ? 'block border-y-4 border-black' : 'hidden'} absolute top-full left-0 w-full bg-personalizedPurple rounded-b-2xl z-20`}>
                <ul className="flex flex-col items-center space-y-4 text-white text-xl py-4">
                    <li>
                        <NavLink
                            to='/'
                            end
                            className={({ isActive }) => isActive ? 'font-semibold text-personalizedOrange' : undefined}
                            onClick={handleLinkClick}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/accounts'
                            end
                            className={({ isActive }) => isActive ? 'font-semibold text-personalizedOrange' : undefined}
                            onClick={handleLinkClick}
                        >
                            Accounts
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/categories'
                            end
                            className={({ isActive }) => isActive ? 'font-semibold text-personalizedOrange' : undefined}
                            onClick={handleLinkClick}
                        >
                            Categories
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/user'
                            end
                            className={({ isActive }) => isActive ? 'font-semibold text-personalizedOrange' : undefined}
                            onClick={handleLinkClick}
                        >
                            <UserIcon />
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};
