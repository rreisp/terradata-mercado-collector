import React from "react";
import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import GlobalStyles from "../../constants/styles";
import { CameraInput } from "../widgets/input/camera";
import { MultiCameraInput } from "../widgets/input/multi-camera";
import NumericInput from "../widgets/input/numeric";
import EF_DepthResearch from "../widgets/com/energy-fuels/depth-research";
import { useLanguage } from "@/contexts/LanguageContext";
import { Checkbox } from "expo-checkbox";
import { Field } from "@/types/field";
import EF_Coordinates from "../widgets/com/energy-fuels/depth-research/coordinates";
import EF_Dates from "../widgets/com/energy-fuels/depth-research/dates";

interface FieldRendererProps {
    field: Field;
    formik: {
        value: any;
        onChange: (fieldId: string, value: any) => void;
    };
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, formik }) => {
    const { language } = useLanguage();
    const { value, onChange } = formik;

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
                    <MultiCameraInput name={field.id} />
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
                        <EF_DepthResearch parent={field.id} />
                    </View>
                </View>
            );
        case "ef_coordinates":
            return (
                <View key={field.id} style={GlobalStyles.fieldContainer}>
                    <Text style={GlobalStyles.label}>{(field.label ? field.label[language] : "")}</Text>
                    <EF_Coordinates />
                </View>
            );
        case "ef_dates":
            return (
                <View key={field.id} style={GlobalStyles.fieldContainer}>
                    <Text style={GlobalStyles.label}>{(field.label ? field.label[language] : "")}</Text>
                    <EF_Dates parent={field.id} />
                </View>
            );
        // Adicione outros componentes especiais aqui quando necessário
        default:
            return null;
    }
};

export default FieldRenderer;
