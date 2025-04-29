import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";

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

type FormSchema = {
    title: string;
    description: string;
    rows: Row[];
    modal: ModalConfig;
    url: string;
    method: string;
};

type FormikHelpers = {
    value: any;
    onChange: (id: string, value: any) => void;
};

const DynamicForm = ({ schemaId }: DynamicFormProps) => {
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");

    useEffect(() => {
        fetch(`https://capturewise.terradata.com.br/load-json.php?id=${schemaId}`)
            .then((res) => res.json())
            .then((data) => setFormSchema(data))
            .catch((err) => console.error("Erro ao carregar schema:", err));
    }, [schemaId]);

    if (!formSchema) return <ActivityIndicator style={{ marginTop: 20 }} />;

    const initialValues: { [key: string]: any } = {};
    const validationShape: { [key: string]: Yup.AnySchema } = {};

    formSchema.rows.forEach(row =>
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
                    <View key={field.id} style={styles.fieldContainer}>
                        <Text>{field.label}</Text>
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
                    <View key={field.id} style={styles.fieldContainer}>
                        <Text>{field.label}</Text>
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
            default:
                return null;
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object(validationShape)}
                onSubmit={(values, { setSubmitting }) => {
                    fetch(formSchema.url, {
                        method: formSchema.method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(values)
                    })
                        .then(res => res.json())
                        .then(() => {
                            setModalContent(formSchema.modal.success.message);
                            setModalVisible(true);
                        })
                        .catch(() => {
                            setModalContent(formSchema.modal.error.message);
                            setModalVisible(true);
                        })
                        .finally(() => setSubmitting(false));
                }}
            >
                {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
                    <>
                        <Text style={styles.title}>{formSchema.title}</Text>
                        <Text style={styles.description}>{formSchema.description}</Text>
                        {formSchema.rows.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {row.columns.map(({ field }) =>
                                    renderField(field, {
                                        value: values[field.id],
                                        onChange: (id, val) => setFieldValue(id, val),
                                    })
                                )}
                            </View>
                        ))}
                        <Button title="Enviar" onPress={handleSubmit} disabled={isSubmitting} />
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
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    row: {
        marginBottom: 20,
    },
    fieldContainer: {
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
    },
    modal: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
});

export default DynamicForm;
