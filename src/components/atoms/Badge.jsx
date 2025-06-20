import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error'
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-3 py-2 text-base'
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.span>
  );
};

export default Badge;