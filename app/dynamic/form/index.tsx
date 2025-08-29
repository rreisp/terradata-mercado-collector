import { useCallback, useState } from "react";
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, Pressable, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";
import GlobalStyles from '../../../constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useLanguage } from "@/contexts/LanguageContext";
import { values } from "@/constants/values";
import { useOperationMode } from '../../../contexts/OperationModeContext';
import { Field } from "@/types/field";
import { FormSchema } from "@/types/form-schema";

import PerfuracaoSchema from '../../../schemas/energy-fuels.perfuracao.json';
import CadastroSchema from '../../../schemas/cw.dialeto.cadastro.json';
import { FormikHelpers } from "@/types/formik-helpers";

import FieldRenderer from "@/components/renderer";
import SafeAreaContainer from "@/components/safe-container";
import { DynamicFormProps } from "@/types/dynamic-form-props";
import { FieldValidator } from "@/components/validator";
import { ActivityIndicator } from "@react-native-material/core";
import { colors } from "@/constants/colors";

const DynamicForm = ({ schemaId, editMode, itemId, extract, load, update }: DynamicFormProps) => {
    const { language } = useLanguage();
    const isOnline = useOperationMode();
    const navigation = useNavigation();
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [loading, setLoading] = useState(true);

    const [initialValues, setInitialValues] = useState<{ [key: string]: any }>({});
    // let initialValues: { [key: string]: any } = {};

    const validationShape: { [key: string]: Yup.AnySchema } = {};

    useFocusEffect(
        useCallback(() => {
            if (isOnline) {
                const loadSchema = async () => {
                    try {
                        const res = await fetch(`https://capturewise.terradata.com.br/load-json.php?id=${schemaId}`);
                        const data = await res.json();
                        setFormSchema(data);
                    } catch (err) {
                        console.error("Erro ao carregar schema:", err);
                    } finally {
                        clearTimeout(timer);
                    }
                };

                // Executa a função e depois continua
                loadSchema();
            } else {
                let schema = null;
                switch (schemaId) {
                    case 'cw.dialeto.cadastro':
                        schema = CadastroSchema;
                        break;
                    case 'energy-fuels.perfuracao':
                        schema = PerfuracaoSchema;
                        break;
                }
                setFormSchema(schema);
            }

            if (editMode) {
                const handleLoad = async () => {
                    const v = await load(itemId);
                    setInitialValues(v);             

                    formSchema?.rows.forEach(row =>
                        row.columns.forEach(({ field }) => {
                            // console.log(field);
                            setInitialValues(prevValues => ({
                                ...prevValues,
                                [field.id]: prevValues[field.id]
                            }));

                            let validator: Yup.AnySchema = getValidatorInstance(field, language);
                            validationShape[field.id] = validator;
                        })
                    );

                    const timer = setTimeout(() => setLoading(false), values.delay);
                    return () => clearTimeout(timer);
                };

                handleLoad();
            } else {
                formSchema?.rows.forEach(row =>
                    row.columns.forEach(({ field }) => {
                        initialValues[field.id] = "";

                        let validator: Yup.AnySchema = getValidatorInstance(field, language);
                        validationShape[field.id] = validator;
                    })
                );
                const timer = setTimeout(() => setLoading(false), values.delay);
                return () => clearTimeout(timer);
            }

        }, [])
    );

    const openList = () => {
        // navigation.navigateDeprecated('loader/list/index', { schemaId: schemaId });
        navigation.navigate('loader/list/index', { schemaId: schemaId }, { pop: true });
    };


    const renderField = (field: Field, formik: FormikHelpers) => {
        return (
            <FieldRenderer key={field.id} field={field} formik={formik} />
        );
    };


    // if (!editMode || Object.keys(initialValues).length > 0) {
    if (!loading) {
        return (
            <SafeAreaContainer>
                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object(validationShape)}
                    onSubmit={async (values, { resetForm }) => {
                        if (!editMode) {
                            await extract(values);
                            navigation.navigate('loader/list/index', { schemaId: schemaId }, { pop: true });
                        } else {
                            await update(values);
                            navigation.navigate('loader/list/index', { schemaId: schemaId }, { pop: true });
                        }
                    }}      

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
                    {({ handleSubmit, validateForm, isSubmitting, values, setFieldValue, setFieldTouched, errors, touched }) => (
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

                                <Text style={GlobalStyles.title}>{formSchema?.title[language] || ""}</Text>
                            </View>
                            <Text style={styles.description}>{formSchema?.description[language] || ""}</Text>
                            {formSchema?.rows.map((row, rowIndex) => (
                                <View key={rowIndex}>
                                    {row.columns.map(({ field }) =>
                                        renderField(field, {
                                            value: values[field.id],
                                            onChange: (id, val) => {
                                                setFieldTouched(id, true);
                                                setFieldValue(id, val);
                                            },
                                            errors,
                                            touched,
                                            setFieldTouched
                                        })
                                    )}
                                </View>
                            ))}
                            <View>
                                <TouchableOpacity style={GlobalStyles.primaryButton}
                                    onPress={async () => {
                                        const errors = await validateForm();

                                        if (Object.keys(errors).length > 0) {
                                            console.log("Erros de validação:", errors);
                                        } else {
                                            handleSubmit(); // dispara o onSubmit se estiver válido
                                        }
                                    }}
                                >
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
            </SafeAreaContainer>
        );
    } else {
        return (
            <SafeAreaContainer>
                <View style={GlobalStyles.centered}>
                    <ActivityIndicator size="large" color={colors.blue} />
                </View>
            </SafeAreaContainer>
        );
    }
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

function getValidatorInstance(field: Field, language: string) {
    let validator: Yup.AnySchema;

    // Validação especial para campos do tipo intervalo de datas (como ef_dates)
    switch (field.type) {
        case 'coordinate_3d':
            validator = FieldValidator.coordinate_3d(field, language);
            break;
        case 'date_range':
            validator = FieldValidator.date_range(field, language);
            break;
        case 'ef_depth_research':
            validator = FieldValidator.ef_depth_research(field, language);
            break;
        default:
            validator = FieldValidator.default(field, language);
            break;
    }
    return validator;
}
