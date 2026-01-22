import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Presentation, Sparkles, Bold, Italic, Heading1, Heading2, Heading3, FileDown, Table } from "lucide-react";
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
import * as XLSX from "xlsx";
import { useConfetti } from "@/hooks/useConfetti";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useExportHistory } from "@/hooks/useExportHistory";
import { useKeyboardShortcuts, shortcutLabels } from "@/hooks/useKeyboardShortcuts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface TextEditorProps {
  onAskAI: (question: string) => void;
  onTextChange?: (text: string) => void;
  externalText?: string;
  externalFileName?: string;
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

const TextEditor = ({ onAskAI, onTextChange, externalText, externalFileName }: TextEditorProps) => {
  const [text, setText] = useState(externalText || "");
  const [isConverting, setIsConverting] = useState(false);
  const [convertingType, setConvertingType] = useState<"word" | "powerpoint" | "pdf" | "excel" | null>(null);
  const [fileName, setFileName] = useState(externalFileName || "");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [headingLevel, setHeadingLevel] = useState<"none" | "h1" | "h2" | "h3">("none");
  const [slideTemplate, setSlideTemplate] = useState<SlideTemplate>("professional");
  const { triggerConfetti } = useConfetti();
  const { addRecord } = useExportHistory();


  // Sync external text when it changes
  useEffect(() => {
    if (externalText !== undefined && externalText !== text) {
      setText(externalText);
    }
  }, [externalText]);

  useEffect(() => {
    if (externalFileName !== undefined && externalFileName !== fileName) {
      setFileName(externalFileName);
    }
  }, [externalFileName]);

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
    setConvertingType("word");
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
      const outputFileName = getFileName("docx");
      saveAs(blob, outputFileName);
      addRecord({
        fileName: outputFileName,
        type: "word",
        preview: text.slice(0, 50) + (text.length > 50 ? "..." : ""),
      });
      triggerConfetti();
      toast.success("Word ဖိုင်ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ!");
    } catch (error) {
      console.error(error);
      toast.error("ပြောင်းလဲရာတွင် အမှားဖြစ်သွားပါသည်");
    } finally {
      setIsConverting(false);
      setConvertingType(null);
    }
  };

  const convertToPowerPoint = async () => {
    if (!text.trim()) {
      toast.error("စာသားရိုက်ထည့်ပါ");
      return;
    }

    setIsConverting(true);
    setConvertingType("powerpoint");
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

      const outputFileName = getFileName("pptx");
      await pptx.writeFile({ fileName: outputFileName });
      addRecord({
        fileName: outputFileName,
        type: "powerpoint",
        preview: text.slice(0, 50) + (text.length > 50 ? "..." : ""),
      });
      triggerConfetti();
      toast.success("PowerPoint ဖိုင်ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ!");
    } catch (error) {
      console.error(error);
      toast.error("ပြောင်းလဲရာတွင် အမှားဖြစ်သွားပါသည်");
    } finally {
      setIsConverting(false);
      setConvertingType(null);
    }
  };

  const convertToPDF = async () => {
    if (!text.trim()) {
      toast.error("စာသားရိုက်ထည့်ပါ");
      return;
    }

    setIsConverting(true);
    setConvertingType("pdf");
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

      const outputFileName = getFileName("pdf");
      pdf.save(outputFileName);
      addRecord({
        fileName: outputFileName,
        type: "pdf",
        preview: text.slice(0, 50) + (text.length > 50 ? "..." : ""),
      });
      triggerConfetti();
      toast.success("PDF ဖိုင်ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ!");
    } catch (error) {
      console.error(error);
      toast.error("ပြောင်းလဲရာတွင် အမှားဖြစ်သွားပါသည်");
    } finally {
      setIsConverting(false);
      setConvertingType(null);
    }
  };

  const convertToExcel = async () => {
    if (!text.trim()) {
      toast.error("စာသားရိုက်ထည့်ပါ");
      return;
    }

    setIsConverting(true);
    setConvertingType("excel");
    try {
      const paragraphs = text.split("\n").filter(p => p.trim());
      
      // Create worksheet data
      const wsData = paragraphs.map((para, index) => {
        if (index === 0) {
          return [para]; // Title row
        }
        return [para];
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Set column width
      ws['!cols'] = [{ wch: 80 }];
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Content");
      
      const outputFileName = getFileName("xlsx");
      XLSX.writeFile(wb, outputFileName);
      addRecord({
        fileName: outputFileName,
        type: "excel",
        preview: text.slice(0, 50) + (text.length > 50 ? "..." : ""),
      });
      triggerConfetti();
      toast.success("Excel ဖိုင်ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ!");
    } catch (error) {
      console.error(error);
      toast.error("ပြောင်းလဲရာတွင် အမှားဖြစ်သွားပါသည်");
    } finally {
      setIsConverting(false);
      setConvertingType(null);
    }
  };

  const handleAIAssist = () => {
    if (!text.trim()) {
      toast.info("AI ကူညီရန် စာသားရိုက်ထည့်ပါ");
      return;
    }
    onAskAI(`ဒီစာသားကို ပိုကောင်းအောင်ပြင်ပေးပါ: ${text}`);
  };

  // Keyboard shortcuts for quick export
  useKeyboardShortcuts({
    onWord: convertToWord,
    onPowerPoint: convertToPowerPoint,
    onPDF: convertToPDF,
    onExcel: convertToExcel,
  }, !isConverting);

  return (
    <>
      <AnimatePresence>
        {isConverting && convertingType && (
          <LoadingSkeleton type={convertingType} />
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="glass rounded-2xl p-6 shadow-elevated"
      >
      <motion.div 
        className="mb-4 flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileText className="h-5 w-5 text-primary" />
        </motion.div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">စာသားရိုက်ထည့်ပါ</h2>
          <p className="text-sm text-muted-foreground">Word သို့မဟုတ် PowerPoint အဖြစ်ပြောင်းလဲနိုင်ပါသည်</p>
        </div>
      </motion.div>

      {/* File Name Input */}
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="ဖိုင်အမည် (ဥပမာ: my-document)"
          className="bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all duration-300 focus:scale-[1.01]"
        />
      </motion.div>

      {/* Formatting Toolbar */}
      <motion.div 
        className="mb-4 flex flex-wrap items-center gap-2 p-2 bg-secondary/30 rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Toggle 
            pressed={isBold} 
            onPressedChange={setIsBold}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all duration-200"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Toggle 
            pressed={isItalic} 
            onPressedChange={setIsItalic}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all duration-200"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
        </motion.div>
        <div className="h-6 w-px bg-border mx-1" />
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Toggle 
            pressed={headingLevel === "h1"} 
            onPressedChange={() => setHeadingLevel(headingLevel === "h1" ? "none" : "h1")}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all duration-200"
          >
            <Heading1 className="h-4 w-4" />
          </Toggle>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Toggle 
            pressed={headingLevel === "h2"} 
            onPressedChange={() => setHeadingLevel(headingLevel === "h2" ? "none" : "h2")}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all duration-200"
          >
            <Heading2 className="h-4 w-4" />
          </Toggle>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Toggle 
            pressed={headingLevel === "h3"} 
            onPressedChange={() => setHeadingLevel(headingLevel === "h3" ? "none" : "h3")}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all duration-200"
          >
            <Heading3 className="h-4 w-4" />
          </Toggle>
        </motion.div>
      </motion.div>

      {/* Slide Template Selector */}
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label className="text-sm font-medium text-foreground mb-2 block">Slide Template</label>
        <Select value={slideTemplate} onValueChange={(v) => setSlideTemplate(v as SlideTemplate)}>
          <SelectTrigger className="bg-secondary/50 border-0 transition-all duration-300 hover:bg-secondary/70">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-4 h-4 rounded bg-[#3B82F6]"
                  whileHover={{ scale: 1.2 }}
                />
                Professional
              </div>
            </SelectItem>
            <SelectItem value="modern">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-4 h-4 rounded bg-[#8B5CF6]"
                  whileHover={{ scale: 1.2 }}
                />
                Modern
              </div>
            </SelectItem>
            <SelectItem value="creative">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-4 h-4 rounded bg-[#F59E0B]"
                  whileHover={{ scale: 1.2 }}
                />
                Creative
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ဤနေရာတွင် သင်၏စာသားကို ရိုက်ထည့်ပါ...

ပထမစာကြောင်းသည် ခေါင်းစဉ်ဖြစ်ပါမည်။
ကျန်စာကြောင်းများသည် အကြောင်းအရာဖြစ်ပါမည်။"
          className="min-h-[180px] resize-none border-0 bg-secondary/50 text-base leading-relaxed placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 transition-all duration-300 focus:scale-[1.01]"
          style={{
            fontWeight: isBold ? "bold" : "normal",
            fontStyle: isItalic ? "italic" : "normal",
          }}
        />
      </motion.div>

      <motion.div 
        className="mt-6 flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div 
                className="flex-1 min-w-[100px]"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="word"
                  size="lg"
                  onClick={convertToWord}
                  disabled={isConverting}
                  className="w-full transition-all duration-300"
                >
                  <motion.div
                    animate={isConverting ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: isConverting ? Infinity : 0 }}
                  >
                    <FileText className="h-5 w-5" />
                  </motion.div>
                  Word
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{shortcutLabels.word}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div 
                className="flex-1 min-w-[100px]"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="powerpoint"
                  size="lg"
                  onClick={convertToPowerPoint}
                  disabled={isConverting}
                  className="w-full transition-all duration-300"
                >
                  <motion.div
                    animate={isConverting ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: isConverting ? Infinity : 0 }}
                  >
                    <Presentation className="h-5 w-5" />
                  </motion.div>
                  PPT
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{shortcutLabels.powerpoint}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div 
                className="flex-1 min-w-[100px]"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="pdf"
                  size="lg"
                  onClick={convertToPDF}
                  disabled={isConverting}
                  className="w-full transition-all duration-300"
                >
                  <motion.div
                    animate={isConverting ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: isConverting ? Infinity : 0 }}
                  >
                    <FileDown className="h-5 w-5" />
                  </motion.div>
                  PDF
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{shortcutLabels.pdf}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div 
                className="flex-1 min-w-[100px]"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="excel"
                  size="lg"
                  onClick={convertToExcel}
                  disabled={isConverting}
                  className="w-full transition-all duration-300"
                >
                  <motion.div
                    animate={isConverting ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: isConverting ? Infinity : 0 }}
                  >
                    <Table className="h-5 w-5" />
                  </motion.div>
                  Excel
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{shortcutLabels.excel}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <motion.div 
          className="flex-1 min-w-[100px]"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="gradient"
            size="lg"
            onClick={handleAIAssist}
            className="w-full transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            AI
          </Button>
        </motion.div>
      </motion.div>
      </motion.div>
    </>
  );
};

export default TextEditor;
