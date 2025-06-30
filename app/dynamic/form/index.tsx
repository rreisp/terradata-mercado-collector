import { useEffect, useState } from "react";
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from '@react-navigation/native';
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

const DynamicForm = ({ schemaId, extract }: DynamicFormProps) => {
    const { language } = useLanguage();
    const isOnline = useOperationMode();
    const navigation = useNavigation();
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), values.delay);
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
            return () => clearTimeout(timer);
        }
    }, [schemaId]);

    const openList = () => {
        navigation.navigate('loader/list/index', { formId: schemaId });
    };

    const initialValues: { [key: string]: any } = {};
    const validationShape: { [key: string]: Yup.AnySchema } = {};

    formSchema?.rows.forEach(row =>
        row.columns.forEach(({ field }) => {
            initialValues[field.id] = "";

            let validator: Yup.AnySchema;

            // Validação especial para campos do tipo intervalo de datas (como ef_dates)
            switch (field.type) {
                case 'coordinate_3d':
                    validator = Yup.object({
                        easting: Yup.number()
                            .required(language == "pt-BR" ? "Campo obrigatório" : "Required field")
                            .typeError(language == "pt-BR" ? "Coordenada inválida" : "Invalid coordinate"),
                        northing: Yup.number()
                            .required(language == "pt-BR" ? "Campo obrigatório" : "Required field")
                            .typeError(language == "pt-BR" ? "Coordenada inválida" : "Invalid coordinate"),
                        elevation: Yup.number()
                            .required(language == "pt-BR" ? "Campo obrigatório" : "Required field")
                            .typeError(language == "pt-BR" ? "Elevação inválida" : "Invalid elevation"),                            
                    });

                    if (field.required) {
                        validator = validator.required(language == "pt-BR" ? "Campo obrigatório" : "Required field");
                    }
                    break;                
                case 'date_range':
                    validator = Yup.object({
                        start: Yup.date()
                            .required(language == "pt-BR" ? "Campo obrigatório" : "Required field")
                            .typeError(language == "pt-BR" ? "Data inválida" : "Invalid date"),
                        end: Yup.date()
                            .required(language == "pt-BR" ? "Campo obrigatório" : "Required field")
                            .typeError(language == "pt-BR" ? "Data inválida" : "Invalid date"),
                    });

                    if (field.required) {
                        validator = validator.required(language == "pt-BR" ? "Campo obrigatório" : "Required field");
                    }
                    break;
                default:
                    // Default para outros campos
                    validator = Yup.string();

                    if (field.required) {
                        validator = validator.required(language == "pt-BR" ? "Campo obrigatório" : "Required field");
                    }

                    if (field.validations?.min_length) {
                        validator = validator.min(
                            field.validations.min_length,
                            field.validations.messages?.min_length
                        );
                    }

                    if (field.validations?.max_length) {
                        validator = validator.max(
                            field.validations.max_length,
                            field.validations.messages?.max_length
                        );
                    }

                    if (field.type === "email") {
                        validator = Yup.string().email(
                            field.validations?.messages?.email ||
                            (language === "pt-BR" ? "E-mail inválido" : "Invalid e-mail")
                        );
                    }
                    break;
            }

            validationShape[field.id] = validator;
        })
    );


    const renderField = (field: Field, formik: FormikHelpers) => {
        return (
            <FieldRenderer key={field.id} field={field} formik={formik} />
        );
    };


    return (
        <SafeAreaContainer>
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object(validationShape)}
                onSubmit={(values) => {
                    extract(values);
                    // console.log(values);
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
