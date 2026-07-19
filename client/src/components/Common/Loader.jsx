import { motion } from 'framer-motion';

export default function Loader({ text = 'Processing...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-4">
      <div className="relative w-12 h-12">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-arena-accent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-arena-accent2"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <span className="text-sm text-arena-muted font-mono">{text}</span>
    </div>
  );
}
