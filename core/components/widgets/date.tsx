import { Text } from 'react-native';
import React, { useState } from 'react';
import { View, Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import GlobalStyles from '@/core/constants/styles';

type DateInputProps = {
    value: string | null;
    onChange: (date: string) => void;
    format?: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
    placeholder?: string;
};

type DateParts = {
    day: number;
    month: number;
    year: number;
};

// Converte uma string para componentes numéricos da data
const parseDate = (
    value: string,
    format: DateInputProps['format']
): DateParts | null => {
    const separator = format === 'yyyy-MM-dd' ? '-' : '/';
    const parts = value.split(separator).map(Number);

    if (parts.length !== 3 || parts.some(Number.isNaN)) {
        return null;
    }

    let day: number;
    let month: number;
    let year: number;

    switch (format) {
        case 'dd/MM/yyyy':
            [day, month, year] = parts;
            break;

        case 'MM/dd/yyyy':
            [month, day, year] = parts;
            break;

        case 'yyyy-MM-dd':
            [year, month, day] = parts;
            break;

        default:
            return null;
    }

    const date = new Date(year, month - 1, day);

    // Impede que datas inválidas sejam normalizadas automaticamente
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return { day, month, year };
};

// Converte string para Date
const toDate = (
    value: string | null,
    format: DateInputProps['format']
): Date => {
    const parts = value ? parseDate(value, format) : null;

    if (!parts) {
        return new Date();
    }

    return new Date(
        parts.year,
        parts.month - 1,
        parts.day
    );
};

// Converte Date para string no formato selecionado
const formatDate = (
    date: Date,
    format: DateInputProps['format']
): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    switch (format) {
        case 'dd/MM/yyyy':
            return `${day}/${month}/${year}`;

        case 'MM/dd/yyyy':
            return `${month}/${day}/${year}`;

        case 'yyyy-MM-dd':
            return `${year}-${month}-${day}`;

        default:
            return `${day}/${month}/${year}`;
    }
};

const DateInput: React.FC<DateInputProps> = ({
    value,
    onChange,
    format = 'dd/MM/yyyy',
    placeholder = 'Selecione uma data',
}) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleDateChange = (
        _event: any,
        selectedDate?: Date
    ) => {
        setShowPicker(false);

        if (selectedDate) {
            onChange(formatDate(selectedDate, format));
        }
    };

    const validDate = value
        ? parseDate(value, format) !== null
        : false;

    return (
        <View>
            <Pressable onPress={() => setShowPicker(true)}>
                <View pointerEvents="none">
                    <View style={GlobalStyles.input}>
                        <Text>
                            {value && validDate ? value : placeholder}
                        </Text>
                    </View>
                </View>
            </Pressable>

            {showPicker && (
                <DateTimePicker
                    value={toDate(value, format)}
                    mode="date"
                    display={
                        Platform.OS === 'ios'
                            ? 'spinner'
                            : 'default'
                    }
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
};

export default DateInput;
