import React, { useEffect, useState } from "react";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, TextInput, Button, Image, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";
import EF_DepthResearch from "@/components/widgets/com/energy-fuels/depth-research";
import GlobalStyles from '../../../constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import PerfuracaoSchema from '../../../schemas/energy-fuels.perfuracao.json';
import EF_Coordinates from "@/components/widgets/com/energy-fuels/depth-research/coordinates";
import EF_Dates from "@/components/widgets/com/energy-fuels/depth-research/dates";
import { useLanguage } from "@/contexts/LanguageContext";
import { values } from "@/constants/values";
import { colors } from "@/constants/colors";

type DynamicFormProps = {
    schemaId: string;
};

type ValidationMessages = {
    min_length?: string;
    max_length?: string;
    email?: string;
};

type FieldValidations = {
    min_length?: number;
    max_length?: number;
    messages: ValidationMessages;
};

type Field = {
    id: string;
    type: string;
    required?: boolean;
    validations?: FieldValidations;
    label?: string;
    placeholder?: string;
    options?: { label: string; value: string }[];
};

type Column = {
    size: number;
    field: Field;
};

type Row = {
    columns: Column[];
};

type ModalConfig = {
    size: string;
    success: {
        header: string;
        message: string;
        button: string;
    };
    error: {
        header: string;
        message: string;
        button: string;
    };
};

// type FormSchema = {
//     title: string;
//     description: string;
//     rows: Row[];
//     modal: ModalConfig;
//     url: string;
//     method: string;
// };

type FormSchema = {
    form_id: string;
    title: string;
    description: string;
    version: string;
    method: string;
    url: string;
    modal: {
        size: string;
        success: {
            header: string;
            message: string;
            button: string;
        };
        error: {
            header: string;
            message: string;
            button: string;
        };
    };
    grid: {
        columns: number;
        spacing: number;
    };
    rows: Array<{
        type: string;
        name?: string;
        label?: string;
        placeholder?: string;
        options?: { label: string; value: string }[];
        required?: boolean;
        [key: string]: any;
    }>;
};


type FormikHelpers = {
    value: any;
    onChange: (id: string, value: any) => void;
};

const DynamicForm = ({ schemaId, extract }: DynamicFormProps) => {
    const { language } = useLanguage();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        let schema = null;
        switch (schemaId) {
            case 'energy-fuels.perfuracao':
                schema = PerfuracaoSchema;
                break;
        }
        setFormSchema(schema);
        const timer = setTimeout(() => setLoading(false), values.delay);
        return () => clearTimeout(timer);
    }, [schemaId]);

    const openList = () => {
        navigation.navigate('loader/list/index', { formId: schemaId });
    };

    // if (!formSchema) return <ActivityIndicator style={{ marginTop: 20 }} />;

    const initialValues: { [key: string]: any } = {};
    const validationShape: { [key: string]: Yup.AnySchema } = {};

    formSchema?.rows.forEach(row =>
        row.columns.forEach(({ field }) => {
            initialValues[field.id] = "";

            let validator: Yup.AnySchema = Yup.string();

            if (field.required) {
                validator = validator.required("Campo obrigatório");
            }

            if (field.validations?.min_length) {
                validator = validator.min(
                    field.validations.min_length,
                    field.validations.messages.min_length
                );
            }

            if (field.validations?.max_length) {
                validator = validator.max(
                    field.validations.max_length,
                    field.validations.messages.max_length
                );
            }

            if (field.type === "email") {
                validator = validator.email(field.validations?.messages.email || "E-mail inválido");
            }

            validationShape[field.id] = validator;
        })
    );

    const renderField = (field: Field, formik: FormikHelpers) => {
        const { value, onChange } = formik;

        switch (field.type) {
            case "text":
            case "email":
            case "number":
            case "password":
                return (
                    <View key={field.id} style={GlobalStyles.fieldContainer}>
                        <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                        <TextInput
                            placeholder={field.placeholder}
                            value={value}
                            onChangeText={(text) => onChange(field.id, text)}
                            style={styles.input}
                            keyboardType={field.type === "number" ? "numeric" : "default"}
                            secureTextEntry={field.type === "password"}
                        />
                    </View>
                );
            case "dropdown":
                return (
                    <View key={field.id} style={GlobalStyles.fieldContainer}>
                        <Text>{field.label[language]}</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={value}
                                onValueChange={(val) => onChange(field.id, val)}
                            >
                                {field.options?.map(opt => (
                                    <Picker.Item label={opt.label} value={opt.value} key={opt.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                );
            case "ef_depth_research":
                return (
                    <View key={field.id} style={GlobalStyles.fieldContainer}>
                        <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                        <View style={styles.pickerContainer}>
                            <EF_DepthResearch parent={field.id} />
                        </View>
                    </View>
                );
            case "ef_coordinates":
                return (
                    <View key={field.id} style={GlobalStyles.fieldContainer}>
                        <Text style={GlobalStyles.label}>{(field.label ? field.label[language] : "")}</Text>
                        <View style={styles.pickerContainer}>
                            <EF_Coordinates />
                        </View>
                    </View>
                );
            case "ef_dates":
                return (
                    <View key={field.id} style={GlobalStyles.fieldContainer}>
                        <Text style={GlobalStyles.label}>{(field.label ? field.label[language] : "")}</Text>
                        <View style={styles.pickerContainer}>
                            <EF_Dates parent={field.id}/>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };


    return (
        <>
            {loading &&
                <View style={GlobalStyles.centered}>
                    <ActivityIndicator size="large" color={colors.blue} />
                </View>
            }
            {!loading &&
                <SafeAreaProvider>
                    <ScrollView style={GlobalStyles.container}>
                        <Formik
                            initialValues={initialValues}
                            // validationSchema={Yup.object(validationShape)}
                            onSubmit={(values) => {
                                extract(values);
                            }}
                        // onSubmit={(values) => {
                        //     const mensagem = Object.entries(values)
                        //         .map(([chave, valor]) => `${chave}: ${valor}`)
                        //         .join('\n');
                        //     alert(mensagem);
                        // }}            

                        // onSubmit={(values, { setSubmitting }) => {
                        //     fetch(formSchema.url, {
                        //         method: formSchema.method,
                        //         headers: { 'Content-Type': 'application/json' },
                        //         body: JSON.stringify(values)
                        //     })
                        //         .then(res => res.json())
                        //         .then(() => {
                        //             setModalContent(formSchema.modal.success.message);
                        //             setModalVisible(true);
                        //         })
                        //         .catch(() => {
                        //             setModalContent(formSchema.modal.error.message);
                        //             setModalVisible(true);
                        //         })
                        //         .finally(() => setSubmitting(false));
                        // }}
                        >
                            {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
                                <>
                                    <View style={GlobalStyles.row}>
                                        <View style={GlobalStyles.col1}>
                                            <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton]} onPress={openList}>
                                                <Icon name="chevron-circle-left" size={16} color="#fff" />
                                            </Pressable>
                                        </View>
                                    </View>
                                    <View style={styles.container}>
                                        <Image
                                            source={require('../../../assets/images/EnergyFuels-Logo.png')}
                                            style={[GlobalStyles.logo, { resizeMode: 'contain' }]}
                                        />

                                        <Text style={GlobalStyles.title}>{formSchema.title[language]}</Text>
                                    </View>
                                    <Text style={styles.description}>{formSchema.description[language]}</Text>
                                    {formSchema.rows.map((row, rowIndex) => (
                                        <View key={rowIndex}>
                                            {row.columns.map(({ field }) =>
                                                renderField(field, {
                                                    value: values[field.id],
                                                    onChange: (id, val) => setFieldValue(id, val),
                                                })
                                            )}
                                        </View>
                                    ))}
                                    <View>
                                        <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleSubmit}>
                                            <View style={GlobalStyles.row}>
                                                <Icon name="save" size={16} color="#fff" style={styles.icon} />
                                                <Text style={styles.buttonText}>{language === 'pt-BR' ? `SALVAR` : `SAVE`}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </Formik>

                        <Modal isVisible={modalVisible}>
                            <View style={styles.modal}>
                                <Text>{modalContent}</Text>
                                <Button title="Fechar" onPress={() => setModalVisible(false)} />
                            </View>
                        </Modal>
                    </ScrollView>
                </SafeAreaProvider>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
    },
    pickerContainer: {
        borderColor: "#ccc",
        borderRadius: 5,
    },
    modal: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
        alignItems: 'center'
    },
    icon: {
        marginHorizontal: 16
    },
});

export default DynamicForm;
