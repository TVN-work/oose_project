import React from 'react';

const Notification = ({ message, type = 'info', onClose }) => {
  const bgColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
      ? 'bg-red-500'
      : type === 'warning'
      ? 'bg-yellow-500'
      : 'bg-blue-500';

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 ${bgColor} text-white max-w-sm fade-in`}
    >
      {message}
    </div>
  );
};

export default Notification;

