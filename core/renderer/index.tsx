import React from "react";
import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import GlobalStyles from "@/core/constants/styles";
import { CameraInput } from "../components/widgets/camera";
import { MultiCameraInput } from "../components/widgets/multi-camera";
import NumericInput from "../components/widgets/numeric";
import { useLanguage } from "@/core/contexts/LanguageContext";
import { Checkbox } from "expo-checkbox";
import { FieldRendererProps } from "@/core/types/field-renderer-props";
import DateTimeInput from "../components/widgets/date";
import DateRangeInput from "../components/widgets/date-range";
import GeoPosition3D from "../components/widgets/geo-position-3d";

import { constants } from "@/core/constants/constants";
import SanitizedTextInput, { removeAccentsAndSpecialChars } from "../components/widgets/sanitized-text-input";
import DateInput from "../components/widgets/date";

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, editMode, formik }) => {
    const { language } = useLanguage();
    const { value, onChange } = formik;
    const isPT = language === 'pt-BR';

    const error = formik.errors?.[field.id];

    switch (field.type) {
        case "photo":
            return (
                <View style={[GlobalStyles.fieldContainer, { marginTop: constants.margin }]}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    {/* TODO: adequar a função handleDelete */}
                    <CameraInput name={field.id} language={language.replace("-", "")} />
                </View>
            );
        case "photos":
            return (
                <View style={[GlobalStyles.fieldContainer, { marginTop: constants.margin }]}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    {/* TODO: adequar a função handleDelete */}
                    <MultiCameraInput name={field.id} handleDelete={() => { }} language={language.replace("-", "")} />
                </View>
            );
        case "number":
            return (
                <View style={[GlobalStyles.fieldContainer, { marginTop: constants.margin }]}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    <NumericInput
                        step={field.step || 1}
                        value={value || ''}
                        max={field.max ?? undefined}
                        min={field.min ?? undefined}
                        onChange={(text: string) => onChange(field.id, text)}
                    />
                    {error && <Text style={GlobalStyles.errorText}>{error}</Text>}
                </View>
            );
        case "currency":
            return (
                <View style={[GlobalStyles.fieldContainer, { marginTop: constants.margin }]}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>

                    {/* A View herda o visual de caixa do GlobalStyles.input */}
                    <View style={[GlobalStyles.input, { flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={{ marginRight: 6, color: '#555', fontWeight: 'bold' }}>
                            {field.currency || "R$"}
                        </Text>

                        <TextInput
                            placeholder={field.placeholder ? field.placeholder[language] : "0.00"}
                            value={value !== undefined && value !== null ? String(value) : ''}
                            onChangeText={(text) => {
                                // 1. Substitui vírgula por ponto
                                let formatted = text.replace(',', '.');

                                // 2. Remove tudo o que não for número ou ponto
                                formatted = formatted.replace(/[^0-9.]/g, '');

                                // 3. Garante que haja apenas um ponto decimal
                                const parts = formatted.split('.');
                                if (parts.length > 2) {
                                    formatted = parts[0] + '.' + parts.slice(1).join('');
                                }

                                // 4. Aplica a precisão máxima de casas decimais (padrão 2)
                                const precision = field.precision !== undefined ? field.precision : 2;
                                if (parts.length === 2 && parts[1].length > precision) {
                                    formatted = `${parts[0]}.${parts[1].substring(0, precision)}`;
                                }

                                onChange(field.id, formatted);
                            }}
                            // Removemos bordas/paddings internos do TextInput para não duplicar o visual da caixa
                            style={{ flex: 1, padding: 0, margin: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                            keyboardType="numeric"
                            maxLength={field.max}
                        />
                    </View>

                    {error && <Text style={GlobalStyles.errorText}>{error}</Text>}
                </View>
            );
        case "text":
        case "email":
        case "password":
            return (
                <View style={[GlobalStyles.fieldContainer, { marginTop: constants.margin }]}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    <TextInput
                        placeholder={field.placeholder ? field.placeholder[language] : ""}
                        value={value || ''}
                        onChangeText={(text) => onChange(field.id, text)}
                        style={GlobalStyles.input}
                        secureTextEntry={field.type === "password"}
                        maxLength={field.max}
                    />
                    {error && <Text style={GlobalStyles.errorText}>{error}</Text>}
                </View>
            );
        case "uppercase_text":
            return (
                <View style={[GlobalStyles.fieldContainer, { marginTop: constants.margin }]}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    <TextInput
                        placeholder={field.placeholder ? field.placeholder[language] : ""}
                        value={value || ''}
                        onChangeText={(text) => onChange(field.id, text.toUpperCase())}
                        style={GlobalStyles.input}
                        autoCapitalize="characters"
                        maxLength={field.max}
                    />
                    {error && <Text style={GlobalStyles.errorText}>{error}</Text>}
                </View>
            );
        case "lowercase_text":
            return (
                <View style={[GlobalStyles.fieldContainer, { marginTop: constants.margin }]}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    <TextInput
                        placeholder={field.placeholder ? field.placeholder[language] : ""}
                        value={value || ''}
                        onChangeText={(text) => onChange(field.id, text.toLowerCase())}
                        style={GlobalStyles.input}
                        autoCapitalize="none"
                        maxLength={field.max}
                    />
                    {error && <Text style={GlobalStyles.errorText}>{error}</Text>}
                </View>
            );
        case "sanitized_text":
            return (
                <View style={[GlobalStyles.fieldContainer, { marginTop: constants.margin }]}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    <SanitizedTextInput
                        placeholder={field.placeholder ? field.placeholder[language] : ""}
                        value={value || ''}
                        onChangeText={(text) => onChange(field.id, text)}
                        style={GlobalStyles.input}
                        maxLength={field.max} onSanitize={removeAccentsAndSpecialChars} />
                    {error && <Text style={GlobalStyles.errorText}>{error}</Text>}
                </View>
            );
        case "checkbox":
            return (
                <View style={[GlobalStyles.fieldContainer, GlobalStyles.section]}>
                    <Checkbox
                        style={GlobalStyles.checkbox}
                        value={value || false}
                        onValueChange={(val) => onChange(field.id, val)}
                    />
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                </View>
            );
        case "select":
            return (
                <View style={[GlobalStyles.fieldContainer, { marginTop: constants.margin }]}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    <View style={GlobalStyles.pickerContainer}>
                        <Picker
                            selectedValue={value}
                            onValueChange={(val) => onChange(field.id, val)}
                            style={GlobalStyles.picker}
                        >
                            {field.options?.map((opt) => (
                                <Picker.Item label={opt.label[language]} value={opt.value} key={opt.value} />
                            ))}
                        </Picker>
                    </View>
                </View>
            );
        case "coordinate_3d":
            return (
                <View key={field.id} style={[GlobalStyles.fieldContainer, { marginTop: constants.margin }]}>
                    <GeoPosition3D parent={field.id} field={field} />
                </View>
            );
        case "date":
            return (
                <View key={field.id} style={[GlobalStyles.fieldContainer, { marginTop: constants.margin }]}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    <DateInput value={value || ''}
                        onChange={(text) => onChange(field.id, text)}
                    />
                    {error && <Text style={GlobalStyles.errorText}>{error}</Text>}
                </View>
            );


        case "date_range":
            return (
                <View key={field.id} style={[GlobalStyles.fieldContainer, { marginTop: constants.margin }]}>
                    <DateRangeInput parent={field.id} error={error} />
                </View>
            );
        // customizados
        // case "ef_depth_research":
        //     return (
        //         <View style={[GlobalStyles.fieldContainer, { marginTop: constants.margin }]}>
        //             <Text style={GlobalStyles.label}>{field.label[language]}</Text>
        //             <View>
        //                 <EF_DepthResearch editMode={editMode ?? false} parent={field.id} />
        //             </View>
        //         </View>
        //     );
        // Adicione outros componentes especiais aqui quando necessário
        default:
            return null;
    }
};

export default FieldRenderer;
