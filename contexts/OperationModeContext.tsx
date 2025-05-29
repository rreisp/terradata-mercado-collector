import React, { createContext, useContext } from 'react';

const isOnline = false;

// Cria o contexto
const OperationModeContext = createContext(isOnline);

// Componente provider
export const OperationModeProvider = ({ children }) => {
    return (
        <OperationModeContext.Provider value={isOnline}>
            {children}
        </OperationModeContext.Provider>
    );
};

// Hook de acesso para os componentes filhos
export const useOperationMode = () => {
    return useContext(OperationModeContext);
};