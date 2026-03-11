import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  variant = 'primary', 
  to, 
  href,
  onClick, 
  className = '',
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-block px-8 py-3 rounded-md font-barlow font-bold uppercase text-center transition-smooth disabled:opacity-50 disabled:cursor-not-allowed tracking-wide';
  
  const variants = {
    primary: 'bg-primary-orange text-white hover:bg-[#E03D0B] hover:shadow-lg',
    secondary: 'bg-transparent text-primary-orange border-2 border-primary-orange underline underline-offset-4 hover:bg-primary-orange hover:text-white hover:no-underline',
    outline: 'bg-transparent text-neutral-black border-2 border-neutral-black hover:bg-neutral-black hover:text-white',
    whatsapp: 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link 
        to={to} 
        className={classes}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
