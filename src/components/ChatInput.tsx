
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hi there! How can I help you set up your account?',
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add user message to chat
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: message,
        sender: 'user',
        timestamp: new Date()
      };
      
      setChatHistory((prev) => [...prev, userMessage]);
      
      // Send to parent
      onSendMessage(message);
      
      // Clear input
      setMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "Thanks for your information. I'll set up your account accordingly.",
          sender: 'assistant',
          timestamp: new Date()
        };
        
        setChatHistory((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-2">
          {chatHistory.map((msg) => (
            <div 
              key={msg.id} 
              className={`chat-message-container ${
                msg.sender === 'user' ? 'chat-message-user' : 'chat-message-assistant'
              }`}
            >
              {msg.content}
              <div className="text-xs opacity-70 text-right mt-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t p-4 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-l-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button
            className="bg-primary text-white p-2 rounded-r-lg hover:bg-primary/90"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
