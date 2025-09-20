import React, { useEffect } from 'react';

const Message = ({ type, text }) => {
  if (!text) return null;

  return <div className={`${type}-message`}>{text}</div>;
};

export default Message;