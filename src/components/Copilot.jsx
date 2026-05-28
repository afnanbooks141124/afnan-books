import { useState } from 'react';

export default function Copilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([{ sender: 'ai', text: 'Hello! I am your AI assistant. Ask me about your business data!' }]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const newChat = [...chatLog, { sender: 'user', text: message }];
    setChatLog(newChat);
    setMessage('');
    setLoading(true);

    try {
      // Connects to your LIVE Render backend!
      const res = await fetch('https://afnan-books.onrender.com/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      setChatLog([...newChat, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      setChatLog([...newChat, { sender: 'ai', text: 'Connection error. Is the backend awake?' }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-purple-600 text-white p-4 rounded-full shadow-2xl text-2xl hover:bg-purple-700">
          ✨
        </button>
      )}
      
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-purple-600 text-white p-3 font-bold flex justify-between">
            <span>AI Copilot</span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
            {chatLog.map((msg, i) => (
              <div key={i} className={`p-2 rounded-lg text-sm w-4/5 ${msg.sender === 'ai' ? 'bg-white border text-gray-700' : 'bg-purple-100 text-purple-800 ml-auto'}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-gray-400 text-xs animate-pulse">AI is thinking...</div>}
          </div>
          
          <div className="p-2 bg-white border-t flex gap-2">
            <input 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about revenue..." 
              className="flex-1 p-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button onClick={sendMessage} className="bg-purple-600 text-white px-3 rounded-lg text-sm font-bold">Ask</button>
          </div>
        </div>
      )}
    </div>
  );
}