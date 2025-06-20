import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={`animate-spin ${iconSizes[size]} ${
            children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''
          }`} 
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`} 
        />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          className={`${iconSizes[size]} ${children ? 'ml-2' : ''}`} 
        />
      )}
    </motion.button>
  );
};

export default Button;