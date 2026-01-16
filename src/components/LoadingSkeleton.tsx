import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type?: "word" | "powerpoint" | "pdf" | "excel";
}

const LoadingSkeleton = ({ type = "word" }: LoadingSkeletonProps) => {
  const colors = {
    word: "from-blue-500/20 to-blue-600/20",
    powerpoint: "from-orange-500/20 to-orange-600/20",
    pdf: "from-red-500/20 to-red-600/20",
    excel: "from-green-500/20 to-green-600/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`bg-gradient-to-br ${colors[type]} p-8 rounded-2xl shadow-elevated border border-border/50`}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Animated document icon */}
          <motion.div
            className="relative"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-16 h-20 bg-card rounded-lg shadow-lg relative overflow-hidden">
              {/* Document lines */}
              <div className="p-2 space-y-2">
                <Skeleton className="h-2 w-full animate-pulse" />
                <Skeleton className="h-2 w-3/4 animate-pulse" />
                <Skeleton className="h-2 w-5/6 animate-pulse" />
                <Skeleton className="h-2 w-2/3 animate-pulse" />
                <Skeleton className="h-2 w-4/5 animate-pulse" />
              </div>
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
            {/* Glow effect */}
            <motion.div
              className="absolute -inset-2 bg-primary/20 rounded-xl blur-xl -z-10"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Loading text */}
          <div className="text-center">
            <motion.p
              className="text-lg font-medium text-foreground"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ဖိုင်ပြင်ဆင်နေသည်...
            </motion.p>
            <p className="text-sm text-muted-foreground mt-1">
              ခဏစောင့်ပါ
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingSkeleton;
