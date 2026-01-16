import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIChatBoxProps {
  initialMessage?: string;
  onClearInitial?: () => void;
}

const AIChatBox = ({ initialMessage, onClearInitial }: AIChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "မင်္ဂလာပါ! ကျွန်တော်သည် AI Assistant ဖြစ်ပါသည်။ Document ပြုလုပ်ရာတွင် ကူညီပေးနိုင်ပါသည်။ မေးခွန်းရှိရင် မေးနိုင်ပါသည်။",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialMessage) {
      handleSend(initialMessage);
      onClearInitial?.();
    }
  }, [initialMessage]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (in production, this would call actual AI API)
    setTimeout(() => {
      const responses = [
        "သင်၏စာသားကို ပြုပြင်ပြီးပါပြီ။ ပိုမိုရှင်းလင်းပြီး ဖတ်ရလွယ်ကူစေရန် ပြုလုပ်ထားပါသည်။",
        "ဤအကြံပြုချက်များကို သုံးနိုင်ပါသည်: စာပိုဒ်များကို ခွဲခြားပါ၊ ခေါင်းစဉ်ကို ရှင်းလင်းစွာရေးပါ။",
        "Document ပြုလုပ်ရာတွင် - ခေါင်းစဉ်ကို ပထမစာကြောင်းတွင်ထည့်ပါ၊ အချက်များကို နောက်စာကြောင်းများတွင် ရေးပါ။",
        "PowerPoint အတွက် - စာကြောင်းတိုတိုများ ရေးပါ၊ Slide တစ်ခုလျှင် အချက် ၄ ခုသာထည့်ပါ။",
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass rounded-2xl shadow-elevated flex flex-col h-[500px]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
          <p className="text-sm text-muted-foreground">ကူညီပေးရန် အသင့်ရှိပါသည်</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  message.role === "user"
                    ? "bg-primary"
                    : "bg-gradient-to-br from-primary to-accent"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <Bot className="h-4 w-4 text-primary-foreground" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">စဉ်းစားနေသည်...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="မေးခွန်းရိုက်ထည့်ပါ..."
            className="flex-1 bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            variant="gradient"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default AIChatBox;
