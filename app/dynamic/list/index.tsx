import React, { useEffect, useState } from "react";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, TextInput, Button, Image, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Pressable } from "react-native";
import * as Yup from "yup";
import Modal from "react-native-modal";
import GlobalStyles from '../../../constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { values } from '../../../constants/values';

import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/constants/colors";
import { useOperationMode } from "@/contexts/OperationModeContext";
import { FormSchema } from "@/types/form-schema";
import { DynamicListProps } from "@/types/dynamic-list-props";

import PerfuracaoSchema from '../../../schemas/energy-fuels.perfuracao.json';
import CadastroSchema from '../../../schemas/cw.dialeto.cadastro.json';

const extract = (info: any) => {
    console.log(info);
    console.warn('Extract Info');
    const drilling = extractDrillingInfo(info);
    console.log(drilling);
    const drillingIntervals = extractDrillingIntervalInfo(info);
    console.log(drillingIntervals);
    const intervalsLithologies = extractIntervalsLithologyInfo(info);
    console.log(intervalsLithologies);
};


const extractDrillingInfo = (info: any) => {
    return {
        drilling_id: info.perfuracao_id,
        easting: info.easting,
        northing: info.northing,
        elevation: info.elevation,
        tenement: info.tenement,
        landowner: info.landowner,
        start_date: info.ef_dates.start,
        end_date: info.ef_dates.end,
        reason: info.reason
    }
};

const extractDrillingIntervalInfo = (info: any) => {
    const size = info.ef_depth_test.depth?.length || 0;
    let intervals = [];
    for (let i = 0; i < size; i++) {
        let obj = {
            depthFrom: info.ef_depth_test.depth[i].from,
            depthTo: info.ef_depth_test.depth[i].to,
            recovery: info.ef_depth_test.runCoreRecovery[i],
            moisture: info.ef_depth_test.moisture[i],
            volume: info.ef_depth_test.volume[i],
            hardness: info.ef_depth_test.hardness[i],
            wash: info.ef_depth_test.wash[i],
            color: info.ef_depth_test.color[i],
            induration: info.ef_depth_test.induration[i],
            grainsize: info.ef_depth_test.grainsize[i],
            sorting: info.ef_depth_test.sorting[i],
            roundness: info.ef_depth_test.roundness[i],
            clay: info.ef_depth_test.clayPct[i],
            micah: info.ef_depth_test.micahPct[i],
            shells: info.ef_depth_test.shellsPct[i],
            organicMatter: info.ef_depth_test.organicMatterPct[i],
            lithicFragments: info.ef_depth_test.lithicFragmentsPct[i],
            hms: info.ef_depth_test.hms[i],
            comments: info.ef_depth_test.comments[i]
        };

        intervals.push(obj);
    }
    return intervals;
};

const extractIntervalsLithologyInfo = (info: any) => {
    console.log(info.ef_depth_test.lithologies);
};

const DynamicList = ({ schemaId }: DynamicListProps) => {
    const { language } = useLanguage();
    const isOnline = useOperationMode();

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), values.delay);
        if (isOnline) {
            fetch(`https://capturewise.terradata.com.br/load-json.php?id=${schemaId}`)
                .then((res) => res.json())
                .then((data) => {
                    setFormSchema(data);
                    return () => clearTimeout(timer);
                })
                .catch((err) => console.error("Erro ao carregar schema:", err));
        } else {
            Icon.loadFont();
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
            const timer = setTimeout(() => setLoading(false), values.delay);
            return () => clearTimeout(timer);
        }
    }, [schemaId]);

    const goBack = () => {
        // navigation.navigate('tools/index', { schemaId });
        navigation.navigate('tools/index', { formId: schemaId });
    };

    const openForm = () => {
        // navigation.navigate('loader/form/index', { schemaId });
        console.warn('schemaId:', schemaId, 'typeof:', typeof schemaId);
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
                                    <Text style={[GlobalStyles.title, GlobalStyles.centered]}>{formSchema?.title[language]|| ""} {String(language) === 'pt-BR' ? `LISTAGEM` : `LIST`}</Text>
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
