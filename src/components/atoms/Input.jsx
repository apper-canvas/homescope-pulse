import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      {label && (
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            focused || hasValue
              ? 'top-2 text-xs text-primary'
              : 'top-4 text-base text-gray-500'
          } ${icon ? 'left-10' : 'left-3'}`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Icon */}
      {icon && (
        <div className="absolute left-3 top-4">
          <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
        </div>
      )}

      {/* Input */}
      <input
        type={type}
        placeholder={focused ? placeholder : ''}
        value={value || ''}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full h-14 border-2 rounded-lg transition-colors focus:outline-none ${
          error
            ? 'border-error focus:border-error'
            : 'border-gray-300 focus:border-primary'
        } ${icon ? 'pl-10 pr-3' : 'px-3'} ${
          label ? 'pt-6 pb-2' : 'py-4'
        }`}
        {...props}
      />

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;