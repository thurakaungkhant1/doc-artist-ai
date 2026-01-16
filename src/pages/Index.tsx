import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, ArrowRight, Presentation, FileDown, Table } from "lucide-react";
import TextEditor from "@/components/TextEditor";
import AIChatBox from "@/components/AIChatBox";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const Index = () => {
  const [aiQuestion, setAiQuestion] = useState<string>("");

  const handleAskAI = (question: string) => {
    setAiQuestion(question);
  };

  const clearAiQuestion = () => {
    setAiQuestion("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 overflow-hidden">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="container pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              type: "spring",
              stiffness: 100,
            }}
            className="flex items-center justify-center gap-4"
          >
            <motion.div 
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-glow animate-glow-ring"
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
              }}
              whileTap={{ scale: 0.95 }}
              variants={floatingVariants}
              animate="animate"
            >
              <FileText className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-3xl font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span className="gradient-text animate-gradient bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent">DocConverter</span>
              </motion.h1>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Text → Word & PowerPoint
              </motion.p>
            </div>
          </motion.div>
        </header>

        {/* Hero Section */}
        <section className="container pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.h2 
              className="text-2xl md:text-3xl font-semibold text-foreground mb-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            >
              စာသားကို <span className="gradient-text">Document</span> အဖြစ်ပြောင်းလဲပါ
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                စာရိုက်ပါ
              </motion.span>
              <motion.div
                animate={{ scale: [1, 1.2, 1], x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                ပြောင်းလဲပါ
              </motion.span>
              <motion.div
                animate={{ scale: [1, 1.2, 1], x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
              >
                ဒေါင်းလုဒ်လုပ်ပါ
              </motion.span>
            </motion.p>
          </motion.div>
        </section>

        {/* Main Content */}
        <main className="container pb-12 px-4">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Text Editor */}
            <motion.div variants={itemVariants}>
              <TextEditor onAskAI={handleAskAI} />
            </motion.div>

            {/* AI Chat Box */}
            <motion.div variants={itemVariants}>
              <AIChatBox 
                initialMessage={aiQuestion} 
                onClearInitial={clearAiQuestion}
              />
            </motion.div>
          </motion.div>
        </main>

        {/* Features */}
        <section className="container pb-12">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              {
                icon: FileText,
                title: "Word",
                description: "Bold, Italic, Headings",
                color: "from-[hsl(217,91%,60%)] to-[hsl(217,91%,50%)]",
              },
              {
                icon: Presentation,
                title: "PowerPoint",
                description: "3 Templates",
                color: "from-[hsl(16,100%,50%)] to-[hsl(16,100%,40%)]",
              },
              {
                icon: FileDown,
                title: "PDF",
                description: "Export လွယ်ကူ",
                color: "from-[hsl(0,72%,51%)] to-[hsl(0,72%,41%)]",
              },
              {
                icon: Table,
                title: "Excel",
                description: "Spreadsheet Export",
                color: "from-[hsl(142,71%,45%)] to-[hsl(142,71%,35%)]",
              },
              {
                icon: Sparkles,
                title: "AI",
                description: "AI ကူညီမည်",
                color: "from-primary to-accent",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.98 }}
                className="glass rounded-xl p-5 text-center hover:shadow-elevated transition-all duration-300 cursor-pointer group"
              >
                <motion.div 
                  className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color}`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="h-6 w-6 text-primary-foreground group-hover:scale-110 transition-transform" />
                </motion.div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="container pb-8">
          <motion.p 
            className="text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            © 2026 DocConverter - <span className="font-medium">thurakaungkhant</span>
          </motion.p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
