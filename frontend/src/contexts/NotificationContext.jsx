import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';
import { io } from 'socket.io-client';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.read).length);
        } catch (err) {
            console.error(err);
        }
    };

    const markRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    // Socket listener for new notifications
    useEffect(() => {
        if (!user) return;

        // We reuse the socket connection logic or create a new one. 
        // Since App.jsx already has one, ideally we should share the socket instance, 
        // but for simplicity/robustness, we can listen for the event if we attach it to the same socket or a new one.
        // However, creating multiple sockets is bad. 
        // Let's assume App.jsx handles the 'notification' event and we can expose a refresh method, 
        // OR we can move socket logic here.
        // For now, let's keep it simple: We will just poll or rely on manual refresh, 
        // OR BETTER: Use the socket in App.jsx to call `fetchNotifications`.

    }, [user]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markRead, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
}
