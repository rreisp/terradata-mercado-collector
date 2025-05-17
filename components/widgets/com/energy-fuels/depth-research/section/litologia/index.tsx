import React, { useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useFormikContext, FieldArray } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import NumericInput from '../../../../../input/numeric';
import { useLanguage } from '@/contexts/LanguageContext';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5'; // ou FontAwesome5, se quiser usar a versão 5

const EF_Litologia = ({ index }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();

    const opcoes = {
        "pt-BR": [
            "Grupo Barreiras",
            "Argila",
            "Argila arenosa",
            "Silte",
            "Areia argilosa",
            "Areia siltosa",
            "Areia",
            "Areia cascalhosa",
            "Solo",
            "Calcário",
            "Rocha"
        ],
        "en-US": [
            "Barreiras Group",
            "Clay",
            "Sandy clay",
            "Silt",
            "Clayey sand",
            "Silty sand",
            "Sand",
            "Gravelly sand",
            "Soil",
            "Limestone",
            "Rock"
        ]
    };

    const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível

    // Garante que o array litologias[index] sempre exista
    useEffect(() => {
        if (!Array.isArray(values.litologias?.[index])) {
            const newLitologias = [...(values.litologias || [])];
            newLitologias[index] = [];
            setFieldValue('litologias', newLitologias);
        }
    }, [index, values.litologias, setFieldValue]);

    const litologiasGrupo = values.litologias?.[index] ?? [];

    return (
        <View style={styles.container}>
            <FieldArray name={`litologias[${index}]`}>
                {({ push, remove }) => (
                    <>
                        <View style={GlobalStyles.row}>
                            <View style={GlobalStyles.col11}>
                                <Text style={styles.label}>{language === 'pt-BR' ? `Litologia` : `Lithology`}:</Text>
                            </View>
                            <View style={GlobalStyles.col1}>
                                <TouchableOpacity style={GlobalStyles.primaryButton} onPress={() => push({ de: '', ate: '', tipo: '' })}>
                                    <Icon name="plus" size={16} color="#fff" style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {litologiasGrupo.length === 0 ? (
                            <Text style={styles.emptyText}>{language === 'pt-BR' ? `Nenhum item adicionado` : `No item found`}.</Text>
                        ) : (
                            litologiasGrupo.map((_, subIndex) => (
                                <View key={subIndex} style={[GlobalStyles.row, styles.row]}>
                                    <View style={GlobalStyles.col2}>
                                        <NumericInput
                                            placeholder={(language === 'pt-BR' ? `De` : `From`)}
                                            value={litologiasGrupo[subIndex]?.de || ''}
                                            onChange={(text) =>
                                                setFieldValue(`litologias[${index}][${subIndex}].de`, text)}
                                            step={1}
                                            min={0.5}
                                            max={2.5}
                                            style={styles.input}
                                        />
                                    </View>

                                    <View style={GlobalStyles.col2}>
                                        <NumericInput
                                            placeholder={(language === 'pt-BR' ? `Até` : `To`)}
                                            value={litologiasGrupo[subIndex]?.ate || ''}
                                            onChange={(text) =>
                                                setFieldValue(`litologias[${index}][${subIndex}].ate`, text)}
                                            step={1}
                                            min={0.5}
                                            max={2.5}
                                            style={styles.input}
                                        />
                                    </View>

                                    <View style={GlobalStyles.col7}>
                                        <View style={GlobalStyles.pickerView}>
                                            <Picker
                                                selectedValue={values.litologias?.[index][subIndex].tipo || valorInicial}
                                                onValueChange={(itemValue) =>
                                                    setFieldValue(`litologias[${index}][${subIndex}].tipo`, itemValue)
                                                }
                                                style={GlobalStyles.picker}
                                            >
                                                {opcoes[language].map((val) => (
                                                    <Picker.Item key={val} label={`${val}`} value={`${val}`} />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>

                                    <View style={[GlobalStyles.col1]}>
                                        <TouchableOpacity style={GlobalStyles.warnButton} onPress={() => remove(subIndex)}>
                                            <Icon name="trash" size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )}
                    </>
                )}
            </FieldArray>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 5 },
    row: { marginVertical: 1 },
    input: {
        flex: 1
    },
    label: { fontWeight: 'bold', flex: 1 },
    emptyText: {
        fontStyle: 'italic',
        color: '#777',
        marginVertical: 4,
        marginLeft: 4,
    },
});

export default EF_Litologia;
