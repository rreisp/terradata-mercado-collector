import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
// import EF_Coordinates from "./EF_Coordinates";
// import EF_Dates from "./EF_Dates";
import GlobalStyles from "../../constants/styles";
import { CameraInput } from "../widgets/input/camera";
import { MultiCameraInput } from "../widgets/input/multi-camera";
import NumericInput from "../widgets/input/numeric";
import EF_DepthResearch from "../widgets/com/energy-fuels/depth-research";
import { useLanguage } from "@/contexts/LanguageContext";
import { Checkbox } from "expo-checkbox";

interface Field {
    id: string;
    type: string;
    label: Record<string, string>;
    placeholder?: Record<string, string>;
    options?: { label: Record<string, string>; value: string }[];
    step?: number;
}

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
                        value={value || ""}
                        max={10}
                        min={5}
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
                        value={value}
                        onValueChange={(val) => onChange(field.id, val)}
                    />
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                </View>
            );
        case "select":
            return (
                <View style={GlobalStyles.fieldContainer}>
                    <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                    <View style={styles.pickerContainer}>
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
                    <View style={styles.pickerContainer}>
                        <EF_DepthResearch parent={field.id} />
                    </View>
                </View>
            );
        // case "ef_coordinates":
        // case "ef_dates":
        // Adicione outros componentes especiais aqui quando necessário
        default:
            return null;
    }
};

export default FieldRenderer;

const styles = StyleSheet.create({
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
    },
});
