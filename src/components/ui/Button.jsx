import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  disabled = false
}) => {
  const baseStyles = "rounded-full font-bold px-6 py-3 transition-all duration-300 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-[#D97706]/20 shadow-md";

  const variants = {
    primary: "bg-[#8B1E1E] hover:bg-[#D97706] text-white hover:shadow-lg",
    secondary: "bg-[#556B2F] hover:bg-[#6B8E23] text-white hover:shadow-lg",
    outline: "border-2 border-[#8B1E1E] text-[#8B1E1E] bg-transparent hover:bg-[#8B1E1E] hover:text-white",
    ghost: "text-[#5C4033] hover:text-[#D97706] hover:bg-[#D97706]/10",
    danger: "bg-[#8B1E1E] text-white hover:bg-[#6E1515]"
  };

  const classes = `${baseStyles} ${variants[variant] || variants.primary} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default Button;
