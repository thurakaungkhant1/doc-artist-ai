import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Presentation, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import pptxgen from "pptxgenjs";
import { saveAs } from "file-saver";
import { toast } from "sonner";

interface TextEditorProps {
  onAskAI: (question: string) => void;
}

const TextEditor = ({ onAskAI }: TextEditorProps) => {
  const [text, setText] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  const convertToWord = async () => {
    if (!text.trim()) {
      toast.error("စာသားရိုက်ထည့်ပါ");
      return;
    }

    setIsConverting(true);
    try {
      const paragraphs = text.split("\n").filter(p => p.trim());
      
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs.map((para, index) => {
              if (index === 0) {
                return new Paragraph({
                  heading: HeadingLevel.HEADING_1,
                  children: [
                    new TextRun({
                      text: para,
                      bold: true,
                      size: 32,
                    }),
                  ],
                });
              }
              return new Paragraph({
                children: [
                  new TextRun({
                    text: para,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              });
            }),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "document.docx");
      toast.success("Word ဖိုင်ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ!");
    } catch (error) {
      toast.error("ပြောင်းလဲရာတွင် အမှားဖြစ်သွားပါသည်");
    } finally {
      setIsConverting(false);
    }
  };

  const convertToPowerPoint = async () => {
    if (!text.trim()) {
      toast.error("စာသားရိုက်ထည့်ပါ");
      return;
    }

    setIsConverting(true);
    try {
      const pptx = new pptxgen();
      pptx.author = "DocConverter";
      pptx.title = "Converted Presentation";
      
      const paragraphs = text.split("\n").filter(p => p.trim());
      
      // Create title slide
      const titleSlide = pptx.addSlide();
      titleSlide.addText(paragraphs[0] || "Presentation", {
        x: 0.5,
        y: 2,
        w: 9,
        h: 1.5,
        fontSize: 36,
        bold: true,
        color: "2563EB",
        align: "center",
      });

      // Create content slides (group paragraphs, max 4 per slide)
      const contentParagraphs = paragraphs.slice(1);
      for (let i = 0; i < contentParagraphs.length; i += 4) {
        const slide = pptx.addSlide();
        const slideContent = contentParagraphs.slice(i, i + 4);
        
        slideContent.forEach((para, index) => {
          slide.addText(`• ${para}`, {
            x: 0.5,
            y: 1 + index * 1.2,
            w: 9,
            h: 1,
            fontSize: 18,
            color: "374151",
            valign: "top",
          });
        });
      }

      await pptx.writeFile({ fileName: "presentation.pptx" });
      toast.success("PowerPoint ဖိုင်ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ!");
    } catch (error) {
      toast.error("ပြောင်းလဲရာတွင် အမှားဖြစ်သွားပါသည်");
    } finally {
      setIsConverting(false);
    }
  };

  const handleAIAssist = () => {
    if (!text.trim()) {
      toast.info("AI ကူညီရန် စာသားရိုက်ထည့်ပါ");
      return;
    }
    onAskAI(`ဒီစာသားကို ပိုကောင်းအောင်ပြင်ပေးပါ: ${text}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 shadow-elevated"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">စာသားရိုက်ထည့်ပါ</h2>
          <p className="text-sm text-muted-foreground">Word သို့မဟုတ် PowerPoint အဖြစ်ပြောင်းလဲနိုင်ပါသည်</p>
        </div>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ဤနေရာတွင် သင်၏စာသားကို ရိုက်ထည့်ပါ...

ပထမစာကြောင်းသည် ခေါင်းစဉ်ဖြစ်ပါမည်။
ကျန်စာကြောင်းများသည် အကြောင်းအရာဖြစ်ပါမည်။"
        className="min-h-[250px] resize-none border-0 bg-secondary/50 text-base leading-relaxed placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20"
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant="word"
          size="lg"
          onClick={convertToWord}
          disabled={isConverting}
          className="flex-1 min-w-[140px]"
        >
          <FileText className="h-5 w-5" />
          Word
        </Button>
        <Button
          variant="powerpoint"
          size="lg"
          onClick={convertToPowerPoint}
          disabled={isConverting}
          className="flex-1 min-w-[140px]"
        >
          <Presentation className="h-5 w-5" />
          PowerPoint
        </Button>
        <Button
          variant="gradient"
          size="lg"
          onClick={handleAIAssist}
          className="flex-1 min-w-[140px]"
        >
          <Sparkles className="h-5 w-5" />
          AI ကူညီမည်
        </Button>
      </div>
    </motion.div>
  );
};

export default TextEditor;
