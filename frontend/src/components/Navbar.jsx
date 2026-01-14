import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-secondary">GigFlow</Link>
                <div className="flex items-center space-x-6">
                    <Link to="/gigs" className="hover:text-secondary transition">Browse Gigs</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="hover:text-secondary transition">Dashboard</Link>

                            {/* Notification Icon */}
                            <NotificationDropdown />

                            <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
                                <span className="hidden md:block text-slate-300 text-sm font-semibold">
                                    {user.fullName}
                                </span>
                                <button onClick={handleLogout} className="bg-slate-800 hover:bg-red-500 px-4 py-2 rounded-lg text-sm transition">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/auth" className="bg-secondary text-primary px-4 py-2 rounded-lg font-semibold hover:bg-teal-400 transition">
                            Login / Join
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
