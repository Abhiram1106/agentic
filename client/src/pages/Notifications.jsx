import React, { useState, useEffect } from 'react';
import { Bell, Info, AlertTriangle, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import API from '../services/api';
import { format } from 'date-fns';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get('/student/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getTypeStyles = (type) => {
    switch (type) {
      case 'Critical': return { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', icon: AlertCircle };
      case 'Warning': return { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700', icon: AlertTriangle };
      default: return { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', icon: Info };
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Notifications</h1>
          <p className="text-gray-500 mt-1">Platform updates and academic alerts.</p>
        </div>
        <button className="text-sm font-bold text-primary hover:underline flex items-center">
          <Trash2 size={16} className="mr-2" /> Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="card h-24 animate-pulse bg-gray-50"></div>)
        ) : notifications.length > 0 ? notifications.map((n) => {
          const styles = getTypeStyles(n.type);
          const Icon = styles.icon;
          return (
            <div 
              key={n._id} 
              onClick={() => markAsRead(n._id)}
              className={`card p-5 flex items-start space-x-4 transition-all cursor-pointer ${n.isRead ? 'opacity-60 grayscale-[0.5]' : 'border-l-4 border-l-primary shadow-md'}`}
            >
              <div className={`p-3 rounded-xl ${styles.bg} ${styles.text}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold ${n.isRead ? 'text-gray-500' : 'text-text'}`}>{n.title}</h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{format(new Date(n.timestamp), 'MMM dd, hh:mm a')}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                {!n.isRead && (
                  <div className="flex items-center mt-3 text-primary text-xs font-bold uppercase tracking-wider">
                    <CheckCircle size={12} className="mr-1.5" /> New Notification
                  </div>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border text-gray-400">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p>No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
