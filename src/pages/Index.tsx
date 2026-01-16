import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, ArrowRight } from "lucide-react";
import TextEditor from "@/components/TextEditor";
import AIChatBox from "@/components/AIChatBox";

const Index = () => {
  const [aiQuestion, setAiQuestion] = useState<string>("");

  const handleAskAI = (question: string) => {
    setAiQuestion(question);
  };

  const clearAiQuestion = () => {
    setAiQuestion("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="container pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-glow animate-pulse-glow">
              <FileText className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="gradient-text">DocConverter</span>
              </h1>
              <p className="text-muted-foreground">Text → Word & PowerPoint</p>
            </div>
          </motion.div>
        </header>

        {/* Hero Section */}
        <section className="container pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              စာသားကို <span className="gradient-text">Document</span> အဖြစ်ပြောင်းလဲပါ
            </h2>
            <p className="text-muted-foreground text-lg flex items-center justify-center gap-2">
              စာရိုက်ပါ <ArrowRight className="h-4 w-4" /> ပြောင်းလဲပါ <ArrowRight className="h-4 w-4" /> ဒေါင်းလုဒ်လုပ်ပါ
            </p>
          </motion.div>
        </section>

        {/* Main Content */}
        <main className="container pb-12">
          <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Text Editor */}
            <TextEditor onAskAI={handleAskAI} />

            {/* AI Chat Box */}
            <AIChatBox 
              initialMessage={aiQuestion} 
              onClearInitial={clearAiQuestion}
            />
          </div>
        </main>

        {/* Features */}
        <section className="container pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            {[
              {
                icon: FileText,
                title: "Word Document",
                description: "စာသားကို .docx ဖိုင်အဖြစ်ပြောင်းပါ",
                color: "from-[hsl(217,91%,60%)] to-[hsl(217,91%,50%)]",
              },
              {
                icon: Sparkles,
                title: "PowerPoint",
                description: "Presentation slides အဖြစ်ပြောင်းပါ",
                color: "from-[hsl(16,100%,50%)] to-[hsl(16,100%,40%)]",
              },
              {
                icon: Sparkles,
                title: "AI ကူညီမည်",
                description: "စာသားကို AI နှင့်တိုးတက်စေပါ",
                color: "from-primary to-accent",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="glass rounded-xl p-5 text-center hover:shadow-elevated transition-shadow duration-300"
              >
                <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color}`}>
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="container pb-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 DocConverter - Text to Document Converter
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
