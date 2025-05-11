import { motion } from 'motion/react'
import { useAdminContext } from '@/hooks/useAdminContext';

const ThemeSwitch = () => {
  const { theme, setTheme } = useAdminContext()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center w-14 h-8 rounded-full p-1 transition-colors duration-300 outline-0 bg-gray-700 `}
      aria-label={`Switch to ${(theme == 'dark') ? 'light' : 'dark'} mode`}
    >
      {/* Sun and Moon Icons (optional) */}
      <div className="absolute flex items-center w-full justify-between pointer-events-none">
        <span className={`text-xs ${(theme == 'dark') ? 'text-gray-400' : 'text-yellow-500'}`}>☀️</span>
        <span className={`text-xs pr-2 ${(theme == 'dark') ? 'text-blue-300' : 'text-gray-500'}`}>🌙</span>
      </div>
      
      {/* Animated ball */}
      <motion.div
        className="w-6 h-6 rounded-full bg-white shadow-md z-10"
        initial={false}
        animate={{
          x: (theme == 'dark') ? '100%' : '0%',
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      />
    </button>
  );
};

export default ThemeSwitch;