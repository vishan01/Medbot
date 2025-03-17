import React, { useState } from 'react';
import './MedBot.css';
import botIcon from '../../assets/bot-icon.png';

const MedBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I am MedBot. How can I assist you with your medical questions today?' }
  ]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (input.trim() === '') return;
    
    // Add user message to chat
    setMessages([...messages, { type: 'user', text: input }]);
    
    // Simulate bot response (in a real app, this would be an API call)
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages, 
        { type: 'bot', text: "I'm processing your medical query. In a real implementation, I would connect to a backend service." }
      ]);
    }, 1000);
    
    setInput('');
  };

  return (
    <div className="medbot-container">
      <div className="medbot-header">
        <img src={botIcon} alt="MedBot Icon" className="medbot-icon" />
        <h1>MedBot Health Assistant</h1>
      </div>
      
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.type === 'bot' && 
                <div className="bot-icon-small">
                  <img src={botIcon} alt="Bot" />
                </div>
              }
              <div className="message-text">{message.text}</div>
            </div>
          ))}
        </div>
        
        <form className="input-container" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            value={input} 
            onChange={handleInputChange} 
            placeholder="Type your medical query here..."
            className="message-input"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
      
      <div className="medbot-footer">
        <p>Disclaimer: MedBot provides general information only and is not a substitute for professional medical advice.</p>
      </div>
    </div>
  );
};

export default MedBot;
