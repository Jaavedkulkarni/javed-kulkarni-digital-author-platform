interface HomeSectionHeaderProps {
  titleMr: string;
  subtitle: string;
  darkMode: boolean;
  className?: string;
}

export function HomeSectionHeader({ titleMr, subtitle, darkMode, className = '' }: HomeSectionHeaderProps) {
  return (
    <div className={`text-center mb-10 lg:mb-12 ${className}`}>
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-navy-800'}`}>
        {titleMr}
      </h2>
      <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{subtitle}</p>
      <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full mt-4" />
    </div>
  );
}

export default HomeSectionHeader;
