import { useEffect, useCallback } from "react";

interface ShortcutHandlers {
  onWord?: () => void;
  onPowerPoint?: () => void;
  onPDF?: () => void;
  onExcel?: () => void;
}

export const useKeyboardShortcuts = (handlers: ShortcutHandlers, enabled: boolean = true) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check if Ctrl+Shift is pressed
    if (!event.ctrlKey || !event.shiftKey) return;
    
    // Prevent triggering when typing in input fields (optional - remove if you want global shortcuts)
    const target = event.target as HTMLElement;
    const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
    
    switch (event.key.toUpperCase()) {
      case "W":
        event.preventDefault();
        if (!isTyping) handlers.onWord?.();
        break;
      case "P":
        event.preventDefault();
        if (!isTyping) handlers.onPowerPoint?.();
        break;
      case "D":
        event.preventDefault();
        if (!isTyping) handlers.onPDF?.();
        break;
      case "E":
        event.preventDefault();
        if (!isTyping) handlers.onExcel?.();
        break;
    }
  }, [handlers]);

  useEffect(() => {
    if (!enabled) return;
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, enabled]);
};

export const shortcutLabels = {
  word: "Ctrl+Shift+W",
  powerpoint: "Ctrl+Shift+P", 
  pdf: "Ctrl+Shift+D",
  excel: "Ctrl+Shift+E",
};
