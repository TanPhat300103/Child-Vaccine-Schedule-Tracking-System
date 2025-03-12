import React, { useState, useEffect, useRef } from 'react';
import '../style/Chatbox.css';

const Chatbox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState(() => {
        return JSON.parse(localStorage.getItem('chatHistory')) || [];
    });
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && chatHistory.length === 0) {
            const welcomeTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const welcomeMessage = {
                sender: 'ai',
                content: 'Xin chào, tôi là trợ lý AI Y tế. Bạn có câu gì cần hỏi tôi không nhé?',
                timestamp: welcomeTimestamp,
            };
            setChatHistory([welcomeMessage]);
        }
    }, [isOpen]);

    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const toggleChatbox = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async () => {
        if (inputMessage.trim() && !isLoading) {
            setIsLoading(true);
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const newUserMessage = { sender: 'user', content: inputMessage, timestamp };
            setChatHistory(prev => [...prev, newUserMessage]);

            // Thêm tin nhắn tạm thời "AI đang soạn..."
            const typingTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const typingMessage = { sender: 'ai', content: 'typing', timestamp: typingTimestamp };
            setChatHistory(prev => [...prev, typingMessage]);

            try {
                let response;
                if (chatHistory.length > 0) {
                    response = await fetch('http://localhost:8080/ai', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            history: chatHistory,
                            prompt: inputMessage,
                        }),
                    });
                } else {
                    response = await fetch(`http://localhost:8080/ai?prompt=${encodeURIComponent(inputMessage)}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.text();
                const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const aiResponse = { sender: 'ai', content: data, timestamp: aiTimestamp };
                // Xóa tin nhắn "typing" và thêm phản hồi thật
                setChatHistory(prev => prev.filter(msg => msg.content !== 'typing').concat(aiResponse));
            } catch (error) {
                const errorTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const errorMessage = { sender: 'ai', content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!', timestamp: errorTimestamp };
                setChatHistory(prev => prev.filter(msg => msg.content !== 'typing').concat(errorMessage));
                console.error('Lỗi khi gọi API:', error);
            } finally {
                setIsLoading(false);
                setInputMessage('');
            }
        }
    };

    const clearChatHistory = () => {
        setChatHistory([]);
        localStorage.removeItem('chatHistory');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSendMessage();
        }
    };

    return (
        <>
            <button className="chat-toggle" onClick={toggleChatbox} disabled={isLoading}>
                💬
            </button>

            {isOpen && (
                <div className="chatbox">
                    <div className="chat-header">
                        <h3>Trò chuyện với AI</h3>
                        <button className="close-btn" onClick={toggleChatbox} disabled={isLoading}>
                            ×
                        </button>
                    </div>
                    <div className="chat-messages">
                        {chatHistory.map((msg, index) => (
                            <div
                                key={index}
                                className={msg.sender === 'user' ? 'user-message-container' : 'ai-message-container'}
                            >
                                {msg.sender === 'ai' && (
                                    <img src="https://img.icons8.com/keek/100/cat.png" alt="AI Avatar" className="avatar ai-avatar" />
                                )}
                                <div className={msg.sender === 'user' ? 'user-message' : 'ai-message'}>
                                    {msg.content === 'typing' ? (
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="message-content">{msg.content}</div>
                                            <div className="message-timestamp">{msg.timestamp}</div>
                                        </>
                                    )}
                                </div>
                                {msg.sender === 'user' && (
                                    <img src="https://img.icons8.com/external-justicon-flat-justicon/64/external-dog-dog-and-cat-justicon-flat-justicon-1.png" alt="User Avatar" className="avatar user-avatar" />
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn..."
                            disabled={isLoading}
                        />
                        <button onClick={handleSendMessage} disabled={isLoading}>
                            Gửi
                        </button>
                        <button onClick={clearChatHistory} disabled={isLoading}>
                            Xóa
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbox;