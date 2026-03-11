const SectionTitle = ({ 
  title, 
  subtitle, 
  align = 'center',
  className = '' 
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`mb-8 md:mb-12 ${alignClasses[align]} ${className}`}>
      {title && (
        <h2 className="font-barlow font-bold text-3xl md:text-4xl lg:text-5xl text-neutral-black mb-4">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-lg md:text-xl text-neutral-darkGreen max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
