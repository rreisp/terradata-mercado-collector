import { TextInput, View, StyleSheet } from 'react-native';
import GlobalStyles from '../../../constants/styles';

function getPrecision(num: number) {
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
    ...props
}) => {
    const maxDecimais = getPrecision(step);

    const regex = maxDecimais > 0
        ? new RegExp(`^\\d*(,\\d{0,${maxDecimais}})?$`)
        : /^\d*$/;

    const handleChange = (text) => {
        if (text === '') {
            onChange('');
            return;
        }

        if (!regex.test(text)) return;

        onChange(text); // permite entrada parcial
    };

    const handleBlur = () => {
        if (!value) return;

        const normalized = value.replace(',', '.');
        const num = parseFloat(normalized);

        if (isNaN(num) || num < min || num > max) {
            onChange(''); // limpa se inválido ou fora dos limites
        }
    };

    return (
        <View style={[styles.container]}>
            <TextInput
                value={value?.toString() || ''}
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
