import { useState, useCallback, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, FileSpreadsheet, File } from "lucide-react";
import { toast } from "sonner";

interface DropZoneProps {
  onFileContent: (content: string, fileName: string) => void;
}

const DropZone = ({ onFileContent }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      
      if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        const text = await file.text();
        onFileContent(text, fileName);
        toast.success(`"${file.name}" ဖိုင်ထည့်သွင်းပြီးပါပြီ!`);
      } else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        const text = await file.text();
        // Convert CSV to readable text
        const lines = text.split("\n").map(line => line.split(",").join("\t"));
        onFileContent(lines.join("\n"), fileName);
        toast.success(`"${file.name}" CSV ဖိုင်ထည့်သွင်းပြီးပါပြီ!`);
      } else if (file.name.endsWith(".json")) {
        const text = await file.text();
        try {
          const json = JSON.parse(text);
          const formatted = JSON.stringify(json, null, 2);
          onFileContent(formatted, fileName);
          toast.success(`"${file.name}" JSON ဖိုင်ထည့်သွင်းပြီးပါပြီ!`);
        } catch {
          onFileContent(text, fileName);
          toast.success(`"${file.name}" ဖိုင်ထည့်သွင်းပြီးပါပြီ!`);
        }
      } else {
        toast.error("ပံ့ပိုးသောဖိုင်အမျိုးအစားများ: .txt, .md, .csv, .json");
      }
    } catch (error) {
      console.error(error);
      toast.error("ဖိုင်ဖတ်ရာတွင် အမှားဖြစ်သွားပါသည်");
    } finally {
      setIsProcessing(false);
      setIsDragging(false);
    }
  };

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, [onFileContent]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-6 shadow-elevated"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Upload className="h-5 w-5 text-accent" />
        </motion.div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">ဖိုင်ထည့်သွင်းရန်</h2>
          <p className="text-sm text-muted-foreground">ဖိုင်ကို ဆွဲချပါ သို့မဟုတ် နှိပ်ပါ</p>
        </div>
      </div>

      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="relative"
      >
        <input
          type="file"
          accept=".txt,.md,.csv,.json"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isProcessing}
        />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={isDragging ? "dragging" : isProcessing ? "processing" : "idle"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              flex flex-col items-center justify-center py-8 px-4 rounded-xl border-2 border-dashed transition-colors
              ${isDragging 
                ? "border-accent bg-accent/10" 
                : "border-border hover:border-primary/50 hover:bg-secondary/50"
              }
              ${isProcessing ? "pointer-events-none" : ""}
            `}
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mb-3"
                >
                  <File className="h-10 w-10 text-primary" />
                </motion.div>
                <p className="text-foreground font-medium">ဖိုင်ဖတ်နေပါသည်...</p>
              </>
            ) : isDragging ? (
              <>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Upload className="h-10 w-10 text-accent mb-3" />
                </motion.div>
                <p className="text-accent font-medium">ဖိုင်ကိုချပါ</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">ဖိုင်ဆွဲချပါ</p>
                <p className="text-sm text-muted-foreground text-center">
                  .txt, .md, .csv, .json ဖိုင်များ ပံ့ပိုးပါသည်
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DropZone;
