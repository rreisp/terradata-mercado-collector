import React from "react";
import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import GlobalStyles from "@/core/constants/styles";
import { CameraInput } from "../components/widgets/camera";
import { MultiCameraInput } from "../components/widgets/multi-camera";
import NumericInput from "../components/widgets/numeric";
import EF_DepthResearch from "../../app-instance/widgets/com/energy-fuels/depth-research";
import { useLanguage } from "@/core/contexts/LanguageContext";
import { Checkbox } from "expo-checkbox";
import { FieldRendererProps } from "@/core/types/field-renderer-props";
import DateRangeInput from "../components/widgets/date-range";
import GeoPosition3D from "../components/widgets/geo-position-3d";

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, editMode, formik }) => {
    const { language } = useLanguage();
    const { value, onChange } = formik;

    const error = formik.errors?.[field.id];
    const touched = formik.touched?.[field.id];

    switch (field.type) {
        case "photo":
            return (
                <View style={GlobalStyles.fieldContainer}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    <CameraInput name={field.id} />
                </View>
            );
        case "photos":
            return (
                <View style={GlobalStyles.fieldContainer}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    <MultiCameraInput editMode={editMode} name={field.id} quality={0.01} />
                </View>
            );
        case "number":
            return (
                <View style={GlobalStyles.fieldContainer}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    <NumericInput
                        step={field.step || 1}
                        value={value || ''}
                        max={field.max ?? undefined}
                        min={field.min ?? undefined}
                        onChange={(text: string) => onChange(field.id, text)}
                    />
                    {/* {easting === '' && ( */}
                        <Text style={GlobalStyles.errorText}>
                            {language === 'pt-BR' ? "Campo obrigatório" : "Required field"}
                        </Text>
                    {/* )} */}
                </View>
            );
        case "text":
        case "email":
        case "password":
            return (
                <View style={GlobalStyles.fieldContainer}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    <TextInput
                        placeholder={field.placeholder ? field.placeholder[language] : ""}
                        value={value || ''}
                        onChangeText={(text) => onChange(field.id, text)}
                        style={GlobalStyles.input}
                        secureTextEntry={field.type === "password"}
                    />
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
                <View style={GlobalStyles.fieldContainer}>
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
        case "ef_depth_research":
            return (
                <View style={GlobalStyles.fieldContainer}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    <View>
                        <EF_DepthResearch editMode={editMode ?? false} parent={field.id} />
                    </View>
                </View>
            );
        case "coordinate_3d":
            return (
                <View key={field.id} style={GlobalStyles.fieldContainer}>
                    <GeoPosition3D parent={field.id} field={field} />
                </View>
            );
        case "date_range":
            return (
                <View key={field.id} style={GlobalStyles.fieldContainer}>
                    <DateRangeInput parent={field.id} />
                </View>
            );
        // Adicione outros componentes especiais aqui quando necessário
        default:
            return null;
    }
};

export default FieldRenderer;
