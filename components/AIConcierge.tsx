"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/hooks/useStore";
import { Send, Sparkles, User, Bot, Loader2, Wand2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AIConcierge() {
  const { aiMessages, addAIMessage, sessions, currentUser } = useStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes("atölye") || lowerMsg.includes("rezervasyon") || lowerMsg.includes("yer")) {
      const availableSessions = sessions.filter(s => s.status === "available");
      if (availableSessions.length > 0) {
        const session = availableSessions[0];
        return `Size uygun atölyeler var! 🎨 "${session.title}" atölyesi ${formatDate(session.date)} saat ${session.time}'te başlıyor. ${session.capacity - session.enrolled} kişilik yer kaldı. Rezervasyon yapmak ister misiniz?`;
      }
      return "Maalesef şu an açık atölye bulunmuyor. Bekleme listesine katılabilirsiniz. 📋";
    }

    if (lowerMsg.includes("fiyat") || lowerMsg.includes("ücret") || lowerMsg.includes("para")) {
      return "Atölye fiyatlarımız 350₺ ile 750₺ arasında değişiyor. Çocuk atölyeleri 350-450₺, aile atölyeleri 750₺. Tüm ücretler oda hesabınıza yansıtılır. 💳";
    }

    if (lowerMsg.includes("çocuk") || lowerMsg.includes("yaş") || lowerMsg.includes("bebek")) {
      return "Atölyelerimiz 4 yaş ve üzeri çocuklar için uygundur. 4-7 yaş arası ebeveyn refakati önerilir. 8 yaş üzeri çocuklar kendi başlarına katılabilir. 👶🎨";
    }

    if (lowerMsg.includes("eğitmen") || lowerMsg.includes("hoca") || lowerMsg.includes("barış") || lowerMsg.includes("hayri")) {
      return "Atölyelerimiz Anadolu Üniversitesi ve Akdeniz Üniversitesi mezunu profesyonel seramik sanatçıları Barış Özarıkça ve Hayri Ünal tarafından yönetilmektedir. Her ikisi de pedagojik formasyona sahiptir. 🏺✨";
    }

    if (lowerMsg.includes("parça") || lowerMsg.includes("eser") || lowerMsg.includes("ürün")) {
      return "Eserleriniz çamur şekillendirildikten sonra hava kuruması için bırakılır. Kuruma süresi ortalama 2-3 gündür. Eserleriniz hazır olduğunda bildirim alacaksınız. Teslim almadan önce lütfen atölyeye uğrayın. 🏺";
    }

    if (lowerMsg.includes("merhaba") || lowerMsg.includes("selam")) {
      return `Merhaba ${currentUser?.name || ""}! 👋 Ben Seramik AI Konsiyerjiniz. Size atölye rezervasyonu, parça durumu veya atölye hakkında bilgi verebilirim. Nasıl yardımcı olabilirim?`;
    }

    if (lowerMsg.includes("saat") || lowerMsg.includes("ne zaman") || lowerMsg.includes("zaman")) {
      return "Atölyeler genellikle sabah 10:00, 11:00 ve öğleden sonra 14:00, 15:00, 16:00 saatlerinde başlar. Her atölye 45-120 dakika sürmektedir. Detaylı program için Atölyeler sekmesine göz atabilirsiniz. ⏰";
    }

    if (lowerMsg.includes("boyama") || lowerMsg.includes("sır") || lowerMsg.includes("renk")) {
      return "Eserlerinizin boyama işlemi çocuk kulüpleri tarafından ayrı bir programda yapılmaktadır. Bu süreç atölyemizin dışındadır ve ayrıca organize edilir. 🎨";
    }

    return "Anladım! Size en iyi şekilde yardımcı olmak için atölye rezervasyonu, parça durumu, fiyat bilgisi veya eğitmenler hakkında sorularınızı yanıtlayabilirim. Başka bir konuda yardıma ihtiyacınız var mı? 🤔";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");

    addAIMessage({ role: "user", content: userMsg });
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const response = generateAIResponse(userMsg);
    addAIMessage({ role: "assistant", content: response });
    setIsTyping(false);
  };

  const quickQuestions = [
    "Yarın hangi atölyeler var?",
    "Fiyatlar nedir?",
    "Eserim ne zaman hazır olur?",
    "Eğitmenler kimler?",
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-8 h-[calc(100vh-200px)] flex flex-col">
      <div>
        <h1 className="font-serif text-3xl text-charcoal-800">AI Konsiyerj</h1>
        <p className="text-charcoal-500 mt-1">Akıllı asistanınız size yardımcı olmak için hazır</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 card-luxury flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {aiMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === "user" 
                  ? "bg-terracotta-100 text-terracotta-600" 
                  : "bg-olive-100 text-olive-600"
              }`}>
                {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.role === "user"
                  ? "bg-terracotta-500 text-white"
                  : "bg-sand-100 text-charcoal-700"
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.role === "user" ? "text-terracotta-200" : "text-charcoal-400"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-olive-100 text-olive-600 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-sand-100 rounded-2xl px-5 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-charcoal-400" />
                  <span className="text-sm text-charcoal-500">Yazıyor...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="px-6 py-3 border-t border-sand-100">
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(q);
                }}
                className="px-3 py-1.5 bg-sand-100 hover:bg-sand-200 text-charcoal-600 rounded-full text-xs font-medium transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-sand-200">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Bir şeyler sorun..."
                className="input-luxury w-full pr-12"
              />
              <Wand2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-300" />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-clay"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
