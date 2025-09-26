import { TextInput, View, StyleSheet } from 'react-native';
import GlobalStyles from '@/core/constants/styles';

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
        ? new RegExp(`^\\d*(\\.\\d{0,${maxDecimais}})?$`) // apenas ponto
        : /^\d*$/;

    const handleChange = (text: string) => {
        if (text === '') {
            onChange('');
            return;
        }

        if (!regex.test(text)) return;

        const num = parseFloat(text);
        if (isNaN(num)) {
            onChange('');
            return;
        }

        if (num < min) {
            onChange(Number(min.toString()));
            return;
        }
        if (num > max) {
            onChange(Number(max.toString()));
            return;
        }

        onChange(text); // mantém string durante edição
    };

    const handleBlur = () => {
        if (value === '' || value === undefined || value === null) return;

        const num = parseFloat(value.toString());
        if (isNaN(num) || num < min || num > max) {
            onChange('');
        } else {
            // força número final com casas decimais definidas pelo step
            if (maxDecimais > 0) {
                onChange(num.toFixed(maxDecimais));
            } else {
                onChange(num.toString());
            }
        }
    };

    return (
        <View style={styles.container}>
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
        flex: 1
    },
    inputDisabled: {
        backgroundColor: '#eee'
    },
});

export default NumericInput;
