import { useState, useEffect } from "react";

export interface ExportRecord {
  id: string;
  fileName: string;
  type: "word" | "powerpoint" | "pdf" | "excel";
  timestamp: Date;
  preview: string;
}

const STORAGE_KEY = "docconverter-export-history";
const MAX_HISTORY = 20;

export const useExportHistory = () => {
  const [history, setHistory] = useState<ExportRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(
          parsed.map((item: ExportRecord) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }))
        );
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addRecord = (record: Omit<ExportRecord, "id" | "timestamp">) => {
    const newRecord: ExportRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    setHistory((prev) => {
      const updated = [newRecord, ...prev].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const removeRecord = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { history, addRecord, clearHistory, removeRecord };
};
