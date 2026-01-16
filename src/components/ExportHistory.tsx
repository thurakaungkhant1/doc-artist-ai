import { motion, AnimatePresence } from "framer-motion";
import { History, FileText, Presentation, FileDown, Table, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportRecord } from "@/hooks/useExportHistory";
import { formatDistanceToNow } from "date-fns";

interface ExportHistoryProps {
  history: ExportRecord[];
  onClear: () => void;
  onRemove: (id: string) => void;
}

const typeIcons = {
  word: FileText,
  powerpoint: Presentation,
  pdf: FileDown,
  excel: Table,
};

const typeColors = {
  word: "text-blue-500 bg-blue-500/10",
  powerpoint: "text-orange-500 bg-orange-500/10",
  pdf: "text-red-500 bg-red-500/10",
  excel: "text-green-500 bg-green-500/10",
};

const ExportHistory = ({ history, onClear, onRemove }: ExportHistoryProps) => {
  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 shadow-elevated"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Export History</h2>
            <p className="text-sm text-muted-foreground">ယခင်ပြောင်းလဲခဲ့သောဖိုင်များ</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Clock className="h-12 w-12 mb-3 opacity-50" />
          <p>မှတ်တမ်းမရှိသေးပါ</p>
          <p className="text-sm">ဖိုင်ပြောင်းလဲပြီးနောက် ဤနေရာတွင်ပေါ်လာပါမည်</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 shadow-elevated"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <History className="h-5 w-5 text-primary" />
          </motion.div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Export History</h2>
            <p className="text-sm text-muted-foreground">{history.length} ဖိုင် ပြောင်းလဲခဲ့သည်</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          ရှင်းလင်း
        </Button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {history.map((record, index) => {
            const Icon = typeIcons[record.type];
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${typeColors[record.type]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{record.fileName}</p>
                  <p className="text-xs text-muted-foreground truncate">{record.preview}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(record.timestamp, { addSuffix: true })}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemove(record.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ExportHistory;
