const SectionTitle = ({ 
  title, 
  subtitle, 
  align = 'center',
  className = '',
  /** `dark`: títulos claros para usar sobre fondo oscuro (evita conflicto con WP) */
  variant = 'light',
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const isDark = variant === 'dark';
  const titleClass = isDark
    ? 'font-barlow font-bold text-3xl md:text-4xl lg:text-5xl !text-white mb-4'
    : 'font-barlow font-bold text-3xl md:text-4xl lg:text-5xl text-neutral-black mb-4';
  const subtitleClass = isDark
    ? 'text-lg md:text-xl text-white/85 max-w-3xl mx-auto font-neue'
    : 'text-lg md:text-xl text-neutral-darkGreen max-w-3xl mx-auto';

  return (
    <div className={`mb-8 md:mb-12 ${alignClasses[align]} ${className}`}>
      {title && (
        <h2 className={titleClass}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={subtitleClass}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
