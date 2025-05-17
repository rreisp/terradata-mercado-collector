import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import GlobalStyles from '../../../constants/styles';

function getPrecision(num) {
    if (!isFinite(num)) return 0;

    const str = num.toString();

    // Verifica se o número é em notação científica
    if (str.includes('e')) {
        const [base, exponent] = str.split('e');
        const decimalPlaces = (base.split('.')[1] || '').length - parseInt(exponent);
        return Math.max(0, decimalPlaces);
    }

    // Número com parte decimal explícita
    const decimalPart = str.split('.')[1];
    return decimalPart ? decimalPart.length : 0;
}

const NumericInput = ({
    value,
    onChange,
    placeholder = '',
    disabled = false,
    step = 1,
    style = {},
    ...props
}) => {

    const handleChange = (text) => {
        // Aceita apenas dígitos, vírgula
        // ignora entrada em demaos casos
        const maxDecimais = getPrecision(step);
        let regex = /^\d*$/;
        if (maxDecimais > 0) {
            regex = new RegExp(`^\\d*(,\\d{0,${maxDecimais}})?$`);
        }
        if (regex.test(text)) {
            onChange(text);
        }
    };

    return (
        <View style={[styles.container, style]}>
            <TextInput
                value={value?.toString()}
                onChangeText={handleChange}
                keyboardType="decimal-pad"
                placeholder={placeholder}
                editable={!disabled}
                style={[
                    GlobalStyles.input,
                    disabled && styles.inputDisabled
                ]}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputDisabled: {
        backgroundColor: '#eee',
        color: '#888',
    },
});

export default NumericInput;
