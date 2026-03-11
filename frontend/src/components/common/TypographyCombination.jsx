/**
 * Componente para combinaciones tipográficas según Manual de Marca
 * Ejemplo: "BICICLETA" (pequeño PP Neue Montreal) + "XXXX" (grande Barlow Black)
 */
const TypographyCombination = ({ 
  smallText, 
  largeText, 
  highlightText,
  className = '',
  smallClassName = '',
  largeClassName = '',
  highlightClassName = ''
}) => {
  return (
    <div className={`title-combined ${className}`}>
      {smallText && (
        <span className={`title-combined-small font-neue font-bold ${smallClassName}`}>
          {smallText}
        </span>
      )}
      {largeText && (
        <span className={`title-combined-large font-barlow font-black ${largeClassName}`}>
          {largeText}
        </span>
      )}
      {highlightText && (
        <span className={`text-highlight mt-2 ${highlightClassName}`}>
          {highlightText}
        </span>
      )}
    </div>
  );
};

export default TypographyCombination;
