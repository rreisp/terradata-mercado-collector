import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import GlobalStyles from '../../../constants/styles';

interface NumericInputProps {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    step?: number;
    min?: number;
    max?: number;
    decimalPlaces?: number;
    style?: ViewStyle;
    inputStyle?: TextStyle;
    buttonStyle?: ViewStyle;
}

const NumericInput: React.FC<NumericInputProps> = ({
    value,
    placeholder,
    onChange,
    step = 1,
    min,
    max,
    decimalPlaces = 0,
    style,
    inputStyle,
    buttonStyle
}) => {
    const handleIncrement = () => {
        let newValue = parseFloat(value || '0') + step;
        newValue = parseFloat(newValue.toFixed(decimalPlaces));

        if (max === undefined || newValue <= max) {
            onChange(newValue.toString());
        }
    };

    const handleDecrement = () => {
        let newValue = parseFloat(value || '0') - step;
        newValue = parseFloat(newValue.toFixed(decimalPlaces));

        if (min === undefined || newValue >= min) {
            onChange(newValue.toString());
        }
    };

    const handleTextChange = (text: string) => {
        const cleanedText = text.replace(/[^0-9.]/g, '');
        if (cleanedText === '' || !isNaN(parseFloat(cleanedText))) {
            onChange(cleanedText);
        }
    };

    return (
        <View style={[GlobalStyles.col2,styles.container]}>
            <View style={[styles.innerContainer, styles.row]}>
                <TouchableOpacity onPress={handleDecrement} style={[styles.button, buttonStyle]}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                    style={[styles.input, inputStyle]}
                    placeholder={placeholder}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={handleTextChange}
                    onBlur={() => {
                        if (value && !isNaN(parseFloat(value))) {
                            const formattedValue = parseFloat(value).toFixed(decimalPlaces);
                            onChange(formattedValue);
                        }
                    }}
                />
                <TouchableOpacity onPress={handleIncrement} style={[styles.button, buttonStyle]}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Estilos permanecem os mesmos do exemplo anterior
const styles = StyleSheet.create({
    container: { marginBottom: 0, flex: 1 },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
        padding: 0,
    },
    button: {
        padding: 15,
        backgroundColor: '#f0f0f0',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        padding: 10,
        textAlign: 'center',
    },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    label: { fontWeight: 'bold', marginBottom: 3 },
});

export default NumericInput;