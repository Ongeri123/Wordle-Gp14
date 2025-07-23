import React from 'react';

const AlertMessage = ({ message, visible }) => {
  if (!visible || !message) return null;

  return (
    <div className="alert-message">
      {message}
    </div>
  );
};

export default AlertMessage;