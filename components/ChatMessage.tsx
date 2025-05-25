import React from 'react';
import { Message } from '../types';
import { USER_AVATAR_URL, ROBOT_AVATAR_URL, EXPERT_AVATAR_URL } from '../constants';

// Helper function to render markdown-like text
const renderChatMessageMarkdown = (markdownText: string | undefined, isUserMessage: boolean) => {
  if (!markdownText) return null;

  // Normalize line breaks for consistent splitting and clean up extra spaces for list items
  const normalizedText = markdownText.replace(/\r\n/g, '\n').replace(/^\s*([*-])\s+/gm, '$1 ');
  
  const blocks = normalizedText.split(/\n\s*\n/).filter(block => block.trim() !== '');

  return (
    <div className={`prose prose-sm max-w-none 
        ${isUserMessage 
            ? 'text-white prose-strong:text-white prose-headings:text-white prose-ul:text-white/90 prose-ol:text-white/90 prose-ul:[&_li::marker]:text-white/70 prose-ol:[&_li::marker]:text-white/70' 
            : 'text-brand-dark-text prose-strong:text-brand-dark-text prose-headings:text-brand-primary prose-ul:text-brand-light-text prose-ol:text-brand-light-text prose-ul:[&_li::marker]:text-brand-primary prose-ol:[&_li::marker]:text-brand-primary'
        }
        prose-p:my-1 first:prose-p:mt-0 last:prose-p:mb-0 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 
    `}>
      {blocks.map((block, index) => {
        const lines = block.split('\n').map(line => line.trim()).filter(line => line !== '');
        const isList = lines.length > 0 && lines.every(line => line.startsWith('- ') || line.startsWith('* '));

        if (isList) {
          return (
            <ul key={index}>
              {lines.map((item, i) => {
                const itemContent = item.substring(item.indexOf(' ') + 1); // Remove bullet point
                const parts = itemContent.split(/(\*\*.*?\*\*)/g).filter(part => part.length > 0);
                return (
                  <li key={i}>
                    {parts.map((part, partIndex) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </li>
                );
              })}
            </ul>
          );
        } else {
          // For paragraphs, also handle **bold** text within the block
          const paragraphParts = block.split(/(\*\*.*?\*\*)/g).filter(part => part.length > 0);
          return (
            <p key={index}>
              {paragraphParts.map((part, partIndex) => {
                 if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                  }
                  // Preserve newline characters within a paragraph block if any were intended (rare for this parser)
                  // This will effectively join lines from a block that wasn't a list.
                  return part.split('\n').map((line, lineIdx) => <React.Fragment key={`${partIndex}-${lineIdx}`}>{line}{lineIdx < part.split('\n').length - 1 && <br />}</React.Fragment>);
              })}
            </p>
          );
        }
      })}
    </div>
  );
};


export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  let avatarUrl = USER_AVATAR_URL;
  let senderName = "You";
  if (message.sender === 'bot') {
    avatarUrl = ROBOT_AVATAR_URL;
    senderName = "DadMind AI";
  } else if (message.sender === 'expert') {
    avatarUrl = EXPERT_AVATAR_URL;
    senderName = "Expert"; // Or use expert's actual name if available in message object
  }

  return (
    <div className={`flex items-end space-x-2.5 my-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <img 
            src={avatarUrl} 
            alt={`${senderName} avatar`} 
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0" 
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40?text=??")}
        />
      )}
      <div
        className={`max-w-[70%] lg:max-w-[65%] px-4 py-3 rounded-2xl shadow-md ${
          isUser
            ? 'bg-gradient-button text-white rounded-br-lg'
            : 'bg-brand-bg-card text-brand-dark-text rounded-bl-lg border border-brand-border'
        }`}
      >
        {renderChatMessageMarkdown(message.text, isUser)}
         {!isUser && (
             <p className="text-xs text-gray-400 mt-1.5 text-right">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
         )}
         {isUser && (
             <p className="text-xs text-white/80 mt-1.5 text-left">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
         )}
      </div>
      {isUser && (
         <img 
            src={avatarUrl} 
            alt="user avatar" 
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40?text=U")}
        />
      )}
    </div>
  );
};
