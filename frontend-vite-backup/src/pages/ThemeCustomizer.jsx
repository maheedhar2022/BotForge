import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Settings, 
  Sparkles, 
  Check, 
  MessageSquare, 
  Send,
  RefreshCw
} from 'lucide-react';

export default function ThemeCustomizer({ chatbot, onUpdate }) {
  // Form Customizer values
  const [botName, setBotName] = useState('AI Assistant');
  const [themeColor, setThemeColor] = useState('#6366f1');
  const [welcomeMessage, setWelcomeMessage] = useState('Hi! How can I help you?');
  const [promptOverride, setPromptOverride] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Widget Preview Interactive conversational state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [typing, setTyping] = useState(false);

  // Hex theme presets (premium sleeks)
  const presets = [
    { name: 'Indigo Dream', hex: '#6366f1' },
    { name: 'Ocean Calm', hex: '#0ea5e9' },
    { name: 'Forest Mint', hex: '#10b981' },
    { name: 'Coral Sunrise', hex: '#f43f5e' },
    { name: 'Golden Amber', hex: '#f59e0b' },
    { name: 'Midnight Dark', hex: '#374151' }
  ];

  useEffect(() => {
    if (chatbot) {
      setBotName(chatbot.bot_name || 'AI Assistant');
      setThemeColor(chatbot.theme_color || '#6366f1');
      setWelcomeMessage(chatbot.welcome_message || 'Hi! How can I help you today?');
      setPromptOverride(chatbot.prompt_override || '');
      
      // Initialize preview messages logs
      setMessages([
        { id: '1', sender: 'bot', message: chatbot.welcome_message || 'Hi! How can I help you today?' }
      ]);
    }
  }, [chatbot]);

  // Handle Save
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bot_name: botName,
          theme_color: themeColor,
          welcome_message: welcomeMessage,
          prompt_override: promptOverride
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        if (onUpdate) onUpdate(); // refresh top layout
      }
    } catch (err) {
      alert('Network failure saving customization settings.');
    } finally {
      setSaving(false);
    }
  };

  // Preview interactive typing chat send
  const handlePreviewSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatbot) return;

    const userText = chatInput.trim();
    setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'visitor', message: userText }]);
    setChatInput('');
    setTyping(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId: chatbot.id,
          visitorId: 'dashboard_test_visitor',
          message: userText
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'bot', message: data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'bot', message: 'Offline. Chat endpoint not reachable.' }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <Palette className="w-7 h-7 text-indigo-400" />
          Widget Customizer & Preview
        </h2>
        <p className="text-slate-400 text-sm mt-1 font-medium">
          Customize chatbot appearance, title, welcome greeting, and test interactions live in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Customization Form Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/60 h-fit">
          <h3 className="font-bold text-base text-slate-200 flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-indigo-400" />
            Branding Configurations
          </h3>

          <form onSubmit={handleSave} className="space-y-5">
            
            {success && (
              <div className="bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-xs px-4 py-3.5 rounded-xl font-medium flex items-center gap-2">
                <Check className="w-4 h-4" />
                Chatbot personalization details saved successfully.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bot Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Assistant Display Name
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-200 text-sm focus:border-indigo-500/80 transition-all font-medium"
                />
              </div>

              {/* Theme Hex Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Theme Primary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-12 h-11 bg-slate-950/60 border border-slate-800 rounded-xl outline-none cursor-pointer px-1 py-1"
                  />
                  <input
                    type="text"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-200 text-sm focus:border-indigo-500/80 transition-all font-medium font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Popular presets */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Harmony Presets Palette
              </label>
              <div className="flex flex-wrap gap-2.5">
                {presets.map((p) => (
                  <button
                    key={p.hex}
                    type="button"
                    onClick={() => setThemeColor(p.hex)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${themeColor === p.hex ? 'border-indigo-500 text-slate-100 bg-slate-900' : 'border-slate-800/80 text-slate-400 hover:border-slate-700 bg-slate-950/40'}`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full inline-block" 
                      style={{ backgroundColor: p.hex }}
                    ></span>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Welcome Greeting */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Welcome Message Line
              </label>
              <input
                type="text"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-200 text-sm focus:border-indigo-500/80 transition-all font-medium"
              />
            </div>

            {/* Prompt Overrides guidance */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  AI Behavior Custom Prompt (Systemic Guidance)
                </label>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wide bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900 uppercase">Pro Feature</span>
              </div>
              <textarea
                rows="3"
                value={promptOverride}
                onChange={(e) => setPromptOverride(e.target.value)}
                placeholder="Example: Keep responses friendly and playful. Recommend our Membership bundle above all else. Inform users we are opening a secondary location soon."
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-200 text-sm placeholder-slate-650 focus:border-indigo-500/80 transition-all font-medium resize-none leading-relaxed"
              ></textarea>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-xl gradient-indigo-violet text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Save Chatbot Configurations
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Side: Active Widget Mockup Previewer */}
        <div className="flex flex-col items-center justify-center">
          
          <div className="w-full max-w-[360px] h-[550px] rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden bg-[#0f172a] relative">
            
            {/* Widget Mockup Header */}
            <div 
              className="px-5 py-4 flex items-center justify-between text-white transition-colors duration-300"
              style={{ backgroundColor: themeColor }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-sm font-bold">
                  {botName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-sm leading-normal">{botName}</h4>
                  <span className="text-[10px] opacity-90 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    Online Assistant
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setMessages([{ id: '1', sender: 'bot', message: welcomeMessage }])}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                title="Restart Chat Preview"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chat list Messages container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#030712]/30">
              {messages.map((m) => (
                <div 
                  key={m.id}
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${m.sender === 'bot' ? 'bg-[#1e293b] text-slate-100 mr-auto rounded-bl-sm border border-slate-800/80' : 'text-white ml-auto rounded-br-sm'}`}
                  style={m.sender === 'visitor' ? { backgroundColor: themeColor } : {}}
                >
                  {m.message}
                </div>
              ))}

              {typing && (
                <div className="bg-[#1e293b] text-slate-400 mr-auto px-4 py-3 rounded-2xl rounded-bl-sm border border-slate-850 flex gap-1 items-center w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-300"></span>
                </div>
              )}
            </div>

            {/* Widget Input Box footer */}
            <form onSubmit={handlePreviewSend} className="p-3 border-t border-slate-800 bg-[#0f172a] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send a test message..."
                className="flex-1 bg-slate-950 border border-slate-850 rounded-full px-4 py-2.5 text-xs outline-none text-slate-200 placeholder-slate-600 focus:border-slate-700 transition-all font-medium"
              />
              <button 
                type="submit"
                style={{ backgroundColor: themeColor }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4 fill-currentColor" />
              </button>
            </form>

          </div>
          
          <span className="text-[10px] text-slate-500 mt-3 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Interactive Widget previewer
          </span>

        </div>

      </div>

    </div>
  );
}
