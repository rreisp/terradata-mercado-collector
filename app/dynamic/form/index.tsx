import { useCallback, useState } from "react";
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";
import GlobalStyles from '@/core/constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useLanguage } from "@/core/contexts/LanguageContext";
import { values } from "@/core/constants/values";
import { useOperationMode } from '@/core/contexts/OperationModeContext';
import { Field } from "@/core/types/field";
import { FormSchema } from "@/core/types/form-schema";
import { FormikHelpers } from "@/core/types/formik-helpers";

import FieldRenderer from "@/core/renderer";
import SafeAreaContainer from "@/core/components/safe-container";
import { DynamicFormProps } from "@/core/types/dynamic-form-props";
import { ActivityIndicator } from "@react-native-material/core";
import { colors } from "@/core/constants/colors";

import schemaRegistry from "@/app-instance/schemas";

const DynamicForm = ({ schemaId, editMode, itemId, extract, load, update, validate }: DynamicFormProps) => {
    const { language } = useLanguage();
    const isOnline = useOperationMode();
    const navigation = useNavigation();
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [loading, setLoading] = useState(true);

    const [initialValues, setInitialValues] = useState<{ [key: string]: any }>({});

    // const validationShape: { [key: string]: Yup.AnySchema } = {};
    const [validationShape, setValidationShape] = useState({})

    const createValidationShape = (schema: FormSchema, valuesToSet: any, language: string) => {
        const newValidationShape: { [key: string]: Yup.AnySchema } = {};
        schema?.rows?.forEach(row => {
            row.columns?.forEach(({ field }) => {
                if (!(field.id in valuesToSet)) {
                    valuesToSet[field.id] = "";
                }
                const validator = getValidatorInstance(validate, field, language);
                if (validator) {
                    newValidationShape[field.id] = validator;
                }
            });
        });
        return newValidationShape;
    };

    useFocusEffect(
        useCallback(() => {
            let mounted = true;
            const fetchData = async () => {
                try {
                    setLoading(true);
                    let schema: FormSchema;
                    let valuesToSet = {};

                    // 1. Carrega o esquema do formulário (online ou offline)
                    if (isOnline) {
                        const res = await fetch(`https://capturewise.terradata.com.br/load-json.php?id=${schemaId}`);
                        schema = await res.json();
                    } else {
                        schema = schemaRegistry[schemaId];
                    }

                    if (!mounted) return;
                    setFormSchema(schema);

                    // 2. Carrega os valores iniciais (se for modo de edição)
                    if (editMode) {
                        valuesToSet = await load(itemId);
                    } else {
                        valuesToSet = {};
                    }

                    const newValidationShape = createValidationShape(schema, valuesToSet, language);

                    if (!mounted) return;
                    setInitialValues(valuesToSet);
                    setValidationShape(newValidationShape);
                } catch (err) {
                    console.error("Erro ao carregar dados:", err);
                    console.error("Detalhes do erro:", err.stack);
                } finally {
                    if (mounted) {
                        setLoading(false);
                    }
                }
            };

            fetchData();

            // Função de cleanup para evitar atualizações de estado em componentes desmontados
            return () => {
                mounted = false;
            };
        }, [schemaId, editMode, language, load, itemId, isOnline])
    );

    const openList = () => {
        // navigation.navigateDeprecated('loader/list/index', { schemaId: schemaId });
        navigation.navigate('loader/list/index', { schemaId: schemaId }, { pop: true });
    };


    const renderField = (field: Field, formik: FormikHelpers) => {
        return (
            <FieldRenderer editMode={editMode} key={field.id} field={field} formik={formik} />
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
                        resetForm();
                    }}
                    validateOnMount={true}

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
                            {formSchema?.rows?.map((row, rowIndex) => (
                                <View key={rowIndex}>
                                    {row?.columns?.map(({ field }) =>
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

function getValidatorInstance(validate, field: Field, language: string) {
    return validate(field, language);
}