import React, { useEffect, useState } from "react";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, TextInput, Button, Image, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";
import GlobalStyles from '../../../constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useLanguage } from "@/contexts/LanguageContext";
import { values } from "@/constants/values";
import { colors } from "@/constants/colors";
import { useOperationMode } from '../../../contexts/OperationModeContext';
import NumericInput from "@/components/widgets/input/numeric";
import { Field } from "@/types/field";
import { FormSchema } from "@/types/form-schema";
import { CameraInput } from "@/components/widgets/input/camera";

import PerfuracaoSchema from '../../../schemas/energy-fuels.perfuracao.json';
import CadastroSchema from '../../../schemas/cw.dialeto.cadastro.json';
import { FormikHelpers } from "@/types/formik-helpers";

const DynamicForm = ({ schemaId }: { schemaId: string }) => {
    const { language } = useLanguage();
    const isOnline = useOperationMode();

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [loading, setLoading] = useState(true);

    // console.warn(isOnline, schemaId);
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

            let validator: Yup.AnySchema = Yup.string();

            if (field.required) {
                validator = validator.required("Campo obrigatório");
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
                validator = Yup.string().email(field.validations?.messages?.email || (language === "pt-BR" ? "E-mail inválido" : "Invalid e-mail"));
            }

            validationShape[field.id] = validator;
        })
    );

    const renderField = (field: Field, formik: FormikHelpers) => {
        const { value, onChange } = formik;
        // console.log(field.label, language);

        switch (field.type) {
            case "photo":
                return (
                    <View key={field.id} style={GlobalStyles.fieldContainer}>
                        <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                        <CameraInput key={field.id} name={field.id} />
                    </View>
                );
            case "number":
                return (
                    <View key={field.id} style={GlobalStyles.fieldContainer}>
                        <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                        <NumericInput
                            step={field.step || 1}
                            // value={value || ""}
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
                    <View key={field.id} style={GlobalStyles.fieldContainer}>
                        <Text style={GlobalStyles.label}>{field.label[language]}</Text>
                        <TextInput
                            placeholder={field.placeholder ? field.placeholder[language] : ""}
                            value={value || 0}
                            onChangeText={(text) => onChange(field.id, text)}
                            style={styles.input}
                            secureTextEntry={field.type === "password"}
                        />
                    </View>
                );
            // case "dropdown":
            //     return (
            //         <View key={field.id} style={GlobalStyles.fieldContainer}>
            //             <Text>{field.label[language]}</Text>
            //             <View style={styles.pickerContainer}>
            //                 <Picker
            //                     selectedValue={""}
            //                     onValueChange={(val) => onChange(field.id, val)}
            //                 >
            //                     {field.options?.map(opt => (
            //                         <Picker.Item label={opt.label} value={opt.value} key={opt.value} />
            //                     ))}
            //                 </Picker>
            //             </View>
            //         </View>
            //     );
            // case "ef_depth_research":
            //     return (
            //         <View key={field.id} style={GlobalStyles.fieldContainer}>
            //             <Text style={GlobalStyles.label}>{field.label[language]}</Text>
            //             <View style={styles.pickerContainer}>
            //                 <EF_DepthResearch parent={field.id} />
            //             </View>
            //         </View>
            //     );
            // case "ef_coordinates":
            //     return (
            //         <View key={field.id} style={GlobalStyles.fieldContainer}>
            //             <Text style={GlobalStyles.label}>{(field.label ? field.label[language] : "")}</Text>
            //             <View style={styles.pickerContainer}>
            //                 <EF_Coordinates />
            //             </View>
            //         </View>
            //     );
            // case "ef_dates":
            //     return (
            //         <View key={field.id} style={GlobalStyles.fieldContainer}>
            //             <Text style={GlobalStyles.label}>{(field.label ? field.label[language] : "")}</Text>
            //             <View style={styles.pickerContainer}>
            //                 <EF_Dates parent={field.id} />
            //             </View>
            //         </View>
            //     );
            default:
                return null;
        }
    };


    return (
        <>
            {(loading || !formSchema) &&
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
                                // extract(values);
                                console.log(values);
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

                                        <Text style={GlobalStyles.title}>{formSchema?.title[language] || ""}</Text>
                                    </View>
                                    <Text style={styles.description}>{formSchema?.description[language] || ""}</Text>
                                    {formSchema?.rows.map((row, rowIndex) => (
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
