import React, { useState, useCallback } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

/**
 * Componente Wrapper para TextInput que permite sanitização de caracteres.
 * * @param {function(string): string} onSanitize - Função para limpar a string.
 * @param {function(string): void} onChangeText - Função padrão de mudança de texto.
 * @param {object} props - Todas as outras props do TextInput.
 */
const SanitizedTextInput = ({
    onSanitize,
    onChangeText,
    value,
    ...rest
}) => {
    // Estado interno para gerenciar o valor exibido, se não for controlado externamente.
    // Usamos 'value' se fornecido, senão, estado interno.
    const [internalValue, setInternalValue] = useState(value || '');

    // Função para aplicar a sanitização e notificar o componente pai
    const handleTextChange = useCallback((text) => {
        let newText = text;

        // 1. Aplica a função de sanitização se ela for fornecida
        if (onSanitize && typeof onSanitize === 'function') {
            newText = onSanitize(text);
        }

        // 2. Se o componente for 'controlado' (com 'value'), 
        //    apenas chamamos o onChangeText com o valor LIMPO.
        if (onChangeText) {
            onChangeText(newText);
        }

        // 3. Se o componente for 'não controlado' (sem 'value'), 
        //    atualizamos o estado interno com o valor LIMPO para exibição.
        if (value === undefined) {
            setInternalValue(newText);
        }

    }, [onSanitize, onChangeText, value]);

    // O valor a ser exibido no TextInput é o 'value' (controlado) ou 'internalValue' (não controlado)
    const displayedValue = value !== undefined ? value : internalValue;

    return (
        <View style={styles.container}>
            <TextInput
                value={displayedValue}
                onChangeText={handleTextChange}
                // Passa todas as outras props do TextInput (placeholder, style, keyboardType, etc.)
                {...rest}
            />
        </View>
    );
};

// --- FUNÇÃO DE EXEMPLO PARA SANITIZAÇÃO ---

/**
 * Função que remove acentos e substitui 'Ç' por 'C', etc.
 * @param {string} text - O texto a ser limpo.
 * @returns {string} - O texto limpo.
 */
export const removeAccentsAndSpecialChars = (text) => {
    if (!text) return "";

    return text
        // Normaliza para decompor caracteres acentuados (ex: 'á' → 'a' + '´')
        .normalize("NFD")
        // Remove apenas os diacríticos (acentos), sem afetar outros símbolos
        .replace(/[\u0300-\u036f]/g, "")
        // Corrige caracteres especiais que não se decompõem bem com NFD
        .replace(/ç/g, "c")
        .replace(/Ç/g, "C")
        .replace(/ñ/g, "n")
        .replace(/Ñ/g, "N")
        .replace(/ß/g, "ss")
        .replace(/ø/g, "o")
        .replace(/Ø/g, "O");
};

export default SanitizedTextInput;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1
    }
});