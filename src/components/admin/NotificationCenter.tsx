import React from 'react';
import { Bell, X, Check, Trash2, Package, Truck, RefreshCw, Star, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useAdmin();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <Truck className="w-4 h-4 text-[#D4AF37]" />;
      case 'stock': return <Package className="w-4 h-4 text-red-500" />;
      case 'return': return <RefreshCw className="w-4 h-4 text-amber-500" />;
      case 'review': return <Star className="w-4 h-4 text-yellow-500" />;
      default: return <ShieldCheck className="w-4 h-4 text-[#12372A]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-[#12372A] text-[#FAF8F1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-base">Atelier Admin Notifications</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#E8DDC7] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="p-3 bg-[#FAF8F1] border-b border-[#E8DDC7] flex justify-between items-center text-xs">
          <span className="text-[#6B5846] font-semibold">
            {notifications.filter(n => !n.read).length} Unread Alerts
          </span>
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="text-red-600 hover:underline flex items-center gap-1 font-bold text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#6B5846]">
              No unread notifications. Everything is up to date!
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  n.read
                    ? 'bg-white border-[#E8DDC7] opacity-75'
                    : 'bg-[#FAF8F1] border-[#D4AF37] shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#12372A]">
                    {getIcon(n.type)}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{n.timestamp}</span>
                </div>
                <p className="text-xs text-[#6B5846] pl-6 font-light">{n.message}</p>
                {!n.read && (
                  <div className="pl-6 pt-1">
                    <span className="text-[10px] text-[#D4AF37] font-bold uppercase flex items-center gap-1">
                      <Check className="w-3 h-3" /> Click to mark read
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
