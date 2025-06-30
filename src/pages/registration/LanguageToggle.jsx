import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-1 bg-gray-200 text-gray-800 rounded-lg text-sm shadow hover:bg-gray-300 transition"
    >
      🌐 {i18n.language === 'en' ? 'English | Español' : 'Español | English'}
    </button>
  );
}
