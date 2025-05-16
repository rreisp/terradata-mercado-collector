import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define os idiomas disponíveis
type Language = 'pt' | 'en';

// Define o formato do contexto
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Cria o contexto com valor padrão (que será sobrescrito pelo provider)
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Hook para consumir o contexto com segurança
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de LanguageProvider');
  }
  return context;
};

// Provider
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
