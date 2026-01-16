import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Presentation, Sparkles, Bold, Italic, Heading1, Heading2, Heading3, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import pptxgen from "pptxgenjs";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { Toggle } from "@/components/ui/toggle";
import jsPDF from "jspdf";

interface TextEditorProps {
  onAskAI: (question: string) => void;
}

type SlideTemplate = "professional" | "modern" | "creative";

const templateColors = {
  professional: {
    title: "2B3A67",
    text: "374151",
    background: "F8FAFC",
    accent: "3B82F6",
  },
  modern: {
    title: "1E293B",
    text: "475569",
    background: "FFFFFF",
    accent: "8B5CF6",
  },
  creative: {
    title: "7C3AED",
    text: "4B5563",
    background: "FEF3C7",
    accent: "F59E0B",
  },
};

const TextEditor = ({ onAskAI }: TextEditorProps) => {
  const [text, setText] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [headingLevel, setHeadingLevel] = useState<"none" | "h1" | "h2" | "h3">("none");
  const [slideTemplate, setSlideTemplate] = useState<SlideTemplate>("professional");

  const getFileName = (extension: string) => {
    const name = fileName.trim() || "document";
    return `${name}.${extension}`;
  };

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
              const isFirstLine = index === 0;
              const currentHeading = isFirstLine && headingLevel !== "none" ? headingLevel : "none";
              
              let heading: typeof HeadingLevel[keyof typeof HeadingLevel] | undefined;
              let fontSize = 24;
              let bold = isBold;
              
              if (currentHeading === "h1" || isFirstLine) {
                heading = HeadingLevel.HEADING_1;
                fontSize = 32;
                bold = true;
              } else if (currentHeading === "h2") {
                heading = HeadingLevel.HEADING_2;
                fontSize = 28;
                bold = true;
              } else if (currentHeading === "h3") {
                heading = HeadingLevel.HEADING_3;
                fontSize = 24;
                bold = true;
              }

              return new Paragraph({
                heading: heading,
                alignment: isFirstLine ? AlignmentType.CENTER : AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: para,
                    bold: bold,
                    italics: isItalic,
                    size: fontSize,
                  }),
                ],
                spacing: { after: 200 },
              });
            }),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, getFileName("docx"));
      toast.success("Word ဖိုင်ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ!");
    } catch (error) {
      console.error(error);
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
      pptx.title = fileName || "Presentation";
      
      const colors = templateColors[slideTemplate];
      const paragraphs = text.split("\n").filter(p => p.trim());
      
      // Create title slide
      const titleSlide = pptx.addSlide();
      titleSlide.addShape("rect", { x: 0, y: 0, w: "100%", h: "100%", fill: { color: colors.background } });
      
      if (slideTemplate === "creative") {
        titleSlide.addShape("rect", { x: 0, y: 0, w: "100%", h: 0.5, fill: { color: colors.accent } });
        titleSlide.addShape("rect", { x: 0, y: 4.6, w: "100%", h: 0.5, fill: { color: colors.accent } });
      } else if (slideTemplate === "modern") {
        titleSlide.addShape("rect", { x: 0, y: 0, w: 0.2, h: "100%", fill: { color: colors.accent } });
      }
      
      titleSlide.addText(paragraphs[0] || "Presentation", {
        x: 0.5,
        y: 2,
        w: 9,
        h: 1.5,
        fontSize: slideTemplate === "creative" ? 40 : 36,
        bold: true,
        color: colors.title,
        align: "center",
        fontFace: "Arial",
      });

      // Create content slides
      const contentParagraphs = paragraphs.slice(1);
      for (let i = 0; i < contentParagraphs.length; i += 4) {
        const slide = pptx.addSlide();
        slide.addShape("rect", { x: 0, y: 0, w: "100%", h: "100%", fill: { color: colors.background } });
        
        if (slideTemplate === "professional") {
          slide.addShape("rect", { x: 0, y: 0, w: "100%", h: 0.8, fill: { color: colors.accent } });
          slide.addText(`Slide ${Math.floor(i / 4) + 2}`, {
            x: 0.5, y: 0.2, w: 9, h: 0.4,
            fontSize: 18, bold: true, color: "FFFFFF", fontFace: "Arial"
          });
        } else if (slideTemplate === "modern") {
          slide.addShape("rect", { x: 0, y: 0, w: 0.2, h: "100%", fill: { color: colors.accent } });
        } else {
          slide.addShape("rect", { x: 0, y: 0, w: "100%", h: 0.3, fill: { color: colors.accent } });
        }
        
        const slideContent = contentParagraphs.slice(i, i + 4);
        const startY = slideTemplate === "professional" ? 1.2 : 1;
        
        slideContent.forEach((para, index) => {
          slide.addText(`• ${para}`, {
            x: 0.8,
            y: startY + index * 1.2,
            w: 8.4,
            h: 1,
            fontSize: 20,
            color: colors.text,
            valign: "top",
            fontFace: "Arial",
          });
        });
      }

      await pptx.writeFile({ fileName: getFileName("pptx") });
      toast.success("PowerPoint ဖိုင်ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ!");
    } catch (error) {
      console.error(error);
      toast.error("ပြောင်းလဲရာတွင် အမှားဖြစ်သွားပါသည်");
    } finally {
      setIsConverting(false);
    }
  };

  const convertToPDF = async () => {
    if (!text.trim()) {
      toast.error("စာသားရိုက်ထည့်ပါ");
      return;
    }

    setIsConverting(true);
    try {
      const pdf = new jsPDF();
      const paragraphs = text.split("\n").filter(p => p.trim());
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let yPosition = 30;
      const lineHeight = 7;

      paragraphs.forEach((para, index) => {
        const isFirstLine = index === 0;
        
        if (isFirstLine) {
          pdf.setFontSize(20);
          pdf.setFont("helvetica", "bold");
        } else {
          pdf.setFontSize(12);
          const fontStyle = isBold && isItalic ? "bolditalic" : isBold ? "bold" : isItalic ? "italic" : "normal";
          pdf.setFont("helvetica", fontStyle);
        }

        const lines = pdf.splitTextToSize(para, maxWidth);
        
        lines.forEach((line: string) => {
          if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          if (isFirstLine) {
            const textWidth = pdf.getTextWidth(line);
            const xPosition = (pageWidth - textWidth) / 2;
            pdf.text(line, xPosition, yPosition);
          } else {
            pdf.text(line, margin, yPosition);
          }
          yPosition += lineHeight;
        });
        
        yPosition += 5;
      });

      pdf.save(getFileName("pdf"));
      toast.success("PDF ဖိုင်ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ!");
    } catch (error) {
      console.error(error);
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

      {/* File Name Input */}
      <div className="mb-4">
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="ဖိုင်အမည် (ဥပမာ: my-document)"
          className="bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Formatting Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2 p-2 bg-secondary/30 rounded-lg">
        <Toggle 
          pressed={isBold} 
          onPressedChange={setIsBold}
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle 
          pressed={isItalic} 
          onPressedChange={setIsItalic}
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <div className="h-6 w-px bg-border mx-1" />
        <Toggle 
          pressed={headingLevel === "h1"} 
          onPressedChange={() => setHeadingLevel(headingLevel === "h1" ? "none" : "h1")}
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle 
          pressed={headingLevel === "h2"} 
          onPressedChange={() => setHeadingLevel(headingLevel === "h2" ? "none" : "h2")}
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle 
          pressed={headingLevel === "h3"} 
          onPressedChange={() => setHeadingLevel(headingLevel === "h3" ? "none" : "h3")}
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
      </div>

      {/* Slide Template Selector */}
      <div className="mb-4">
        <label className="text-sm font-medium text-foreground mb-2 block">Slide Template</label>
        <Select value={slideTemplate} onValueChange={(v) => setSlideTemplate(v as SlideTemplate)}>
          <SelectTrigger className="bg-secondary/50 border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#3B82F6]" />
                Professional
              </div>
            </SelectItem>
            <SelectItem value="modern">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#8B5CF6]" />
                Modern
              </div>
            </SelectItem>
            <SelectItem value="creative">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#F59E0B]" />
                Creative
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ဤနေရာတွင် သင်၏စာသားကို ရိုက်ထည့်ပါ...

ပထမစာကြောင်းသည် ခေါင်းစဉ်ဖြစ်ပါမည်။
ကျန်စာကြောင်းများသည် အကြောင်းအရာဖြစ်ပါမည်။"
        className="min-h-[180px] resize-none border-0 bg-secondary/50 text-base leading-relaxed placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20"
        style={{
          fontWeight: isBold ? "bold" : "normal",
          fontStyle: isItalic ? "italic" : "normal",
        }}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant="word"
          size="lg"
          onClick={convertToWord}
          disabled={isConverting}
          className="flex-1 min-w-[100px]"
        >
          <FileText className="h-5 w-5" />
          Word
        </Button>
        <Button
          variant="powerpoint"
          size="lg"
          onClick={convertToPowerPoint}
          disabled={isConverting}
          className="flex-1 min-w-[100px]"
        >
          <Presentation className="h-5 w-5" />
          PPT
        </Button>
        <Button
          variant="pdf"
          size="lg"
          onClick={convertToPDF}
          disabled={isConverting}
          className="flex-1 min-w-[100px]"
        >
          <FileDown className="h-5 w-5" />
          PDF
        </Button>
        <Button
          variant="gradient"
          size="lg"
          onClick={handleAIAssist}
          className="flex-1 min-w-[100px]"
        >
          <Sparkles className="h-5 w-5" />
          AI
        </Button>
      </div>
    </motion.div>
  );
};

export default TextEditor;
