import React, { useEffect, useState } from "react";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, TextInput, Button, Image, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Pressable } from "react-native";
import * as Yup from "yup";
import Modal from "react-native-modal";
import GlobalStyles from '../../../constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { values } from '../../../constants/values';

type DynamicListProps = {
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

import PerfuracaoSchema from '../../../schemas/energy-fuels.perfuracao.json';
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigation } from "@react-navigation/native";
import { colors } from "@/constants/colors";

const DynamicList = ({ schemaId }: DynamicListProps) => {
    const { language } = useLanguage();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Icon.loadFont();
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

    const goBack = () => {
        navigation.navigate('tools/index', { formId: schemaId });
    };

    const openForm = () => {
        navigation.navigate('loader/form/index', { formId: schemaId });
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
                        <>
                            <View style={GlobalStyles.row}>
                                <View style={GlobalStyles.col1}>
                                    <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton]} onPress={goBack}>
                                        <Icon name="chevron-circle-left" size={16} color="#fff" />
                                    </Pressable>
                                </View>
                            </View>
                            <View style={GlobalStyles.row}>
                                <View style={[GlobalStyles.col, styles.center]}>
                                    <Image
                                        source={require('../../../assets/images/EnergyFuels-Logo.png')}
                                        style={[GlobalStyles.logo, { resizeMode: 'contain' }]}
                                    />
                                    <Text style={[GlobalStyles.title, GlobalStyles.centered]}>{formSchema.title[language]} {language === 'pt-BR' ? `LISTAGEM` : `LIST`}</Text>
                                </View>
                            </View>
                            <View style={GlobalStyles.row}>
                                <View style={GlobalStyles.col11}></View>
                                <View style={GlobalStyles.col1}>
                                    <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton]} onPress={openForm}>
                                        <Icon name="plus" size={16} color="#fff" />
                                    </Pressable>
                                </View>
                            </View>
                            <View style={GlobalStyles.row}>
                                <View style={GlobalStyles.col12}>
                                    <ScrollView>

                                    </ScrollView>
                                </View>
                            </View>
                        </>
                        <Modal isVisible={modalVisible}>
                            <View style={styles.modal}>
                                <Text>{modalContent}</Text>
                                <Button title="Fechar" onPress={() => setModalVisible(false)} />
                            </View>
                        </Modal>
                    </ScrollView>
                </SafeAreaProvider >
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
    center: {
        alignContent: "center",
        alignItems: 'center'
    }
});

export default DynamicList;
