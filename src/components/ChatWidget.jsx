import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Bonjour ! 👋 Je suis Claude, l'assistant de PANTOUFLES. Comment puis-je vous aider ?",
            sender: 'bot'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        // Ajouter le message de l'utilisateur
        const userMessage = {
            id: messages.length + 1,
            text: input,
            sender: 'user'
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Appeler le backend
            const response = await fetch('http://localhost:5003/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: input
                })
            });

            const data = await response.json();

            if (data.success) {
                // Ajouter la réponse de Claude
                const botMessage = {
                    id: messages.length + 2,
                    text: data.reply,
                    sender: 'bot'
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                // Erreur
                const errorMessage = {
                    id: messages.length + 2,
                    text: '❌ Erreur de communication. Veuillez réessayer.',
                    sender: 'bot'
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error('Erreur:', error);
            const errorMessage = {
                id: messages.length + 2,
                text: '❌ Impossible de se connecter. Vérifiez que le serveur est lancé.',
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Bouton flottant */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition transform hover:scale-110 z-40"
                    title="Chat avec Claude"
                >
                    <MessageCircle size={24} />
                </button>
            )}

            {/* Widget Chat */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 max-w-[90vw] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-purple-200">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">Claude Assistant</h3>
                            <p className="text-sm opacity-90">🩴 PANTOUFLES</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg ${
                                        msg.sender === 'user'
                                            ? 'bg-purple-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border-2 border-gray-200 rounded-bl-none'
                                    }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 border-2 border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                                    <p className="text-sm">✏️ Claude répond...</p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSendMessage}
                        className="border-t border-gray-200 p-4 bg-white rounded-b-2xl flex gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Votre question..."
                            disabled={loading}
                            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default ChatWidget;