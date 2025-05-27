import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import GlobalStyles from '../../../constants/styles';

function getPrecision(num) {
    if (!isFinite(num)) return 0;
    const str = num.toString();

    if (str.includes('e')) {
        const [base, exponent] = str.split('e');
        const decimalPlaces = (base.split('.')[1] || '').length - parseInt(exponent);
        return Math.max(0, decimalPlaces);
    }

    const decimalPart = str.split('.')[1];
    return decimalPart ? decimalPart.length : 0;
}

const NumericInput = ({
    value,
    onChange,
    placeholder = '',
    disabled = false,
    step = 1,
    min = -Infinity,
    max = Infinity,
    style = {},
    ...props
}) => {
    const maxDecimais = getPrecision(step);

    const regex = maxDecimais > 0
        ? new RegExp(`^\\d*(,\\d{0,${maxDecimais}})?$`)
        : /^\d*$/;

    const handleChange = (text) => {
        // Permite apagar tudo
        if (text === '') {
            onChange('');
            return;
        }

        // Valida formato básico (ex: apenas dígitos e vírgula)
        if (!regex.test(text)) return;

        onChange(text); // Aceita o valor mesmo se intermediário
    };

    const handleBlur = () => {
        if (!value) return;

        const normalized = value.replace(',', '.');
        const num = parseFloat(normalized);

        if (isNaN(num)) return;

        // Aplica min/max no blur
        let clamped = num;
        if (num < min) clamped = min;
        if (num > max) clamped = max;

        // Volta para string com vírgula
        const fixed = clamped.toFixed(getPrecision(step)).replace('.', ',');

        if (fixed !== value) {
            onChange(fixed);
        }
    };

    return (
        <View style={[styles.container, style]}>
            <TextInput
                value={value?.toString()}
                onChangeText={handleChange}
                onBlur={handleBlur}
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
