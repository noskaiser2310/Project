
import React from 'react';
import { Message } from '../types';
import { USER_AVATAR_URL, ROBOT_AVATAR_URL, EXPERT_AVATAR_URL } from '../constants'; // Assuming these are defined

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  let avatarUrl = USER_AVATAR_URL;
  if (message.sender === 'bot') avatarUrl = ROBOT_AVATAR_URL;
  else if (message.sender === 'expert') avatarUrl = EXPERT_AVATAR_URL;

  return (
    <div className={`flex items-end space-x-3 my-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <img src={avatarUrl} alt={`${message.sender} avatar`} className="w-8 h-8 rounded-full object-cover" />
      )}
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow ${
          isUser
            ? 'bg-gradient-button text-white rounded-br-none'
            : 'bg-white text-gray-700 rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
      </div>
      {isUser && (
         <img src={avatarUrl} alt="user avatar" className="w-8 h-8 rounded-full object-cover" />
      )}
    </div>
  );
};
