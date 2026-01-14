import { useState, useContext, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { NotificationContext } from '../contexts/NotificationContext';

export default function NotificationDropdown() {
    const { notifications, unreadCount, markRead } = useContext(NotificationContext);
    const [isOpen, setIsOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const close = (e) => {
            if (!e.target.closest('.notification-container')) setIsOpen(false);
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, []);

    return (
        <div className="relative notification-container">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-300 hover:text-white transition"
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-slate-100">
                    <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-primary">Notifications</h3>
                        <span className="text-xs text-slate-500">{unreadCount} unread</span>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map(notif => (
                            <div
                                key={notif._id}
                                className={`p-4 border-b hover:bg-slate-50 transition cursor-pointer ${notif.read ? 'opacity-60' : 'bg-blue-50'}`}
                                onClick={() => markRead(notif._id)}
                            >
                                <p className="text-sm text-slate-800">{notif.message}</p>
                                <span className="text-xs text-slate-400 mt-1 block">
                                    {new Date(notif.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        )) : (
                            <div className="p-6 text-center text-slate-400 text-sm">
                                No notifications yet.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
