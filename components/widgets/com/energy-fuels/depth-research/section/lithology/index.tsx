import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFormikContext, FieldArray } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import NumericInput from '../../../../../input/numeric';
import { useLanguage } from '@/contexts/LanguageContext';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';

const EF_Lithology = ({ index, parent, start, end }) => {
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

    const valorInicial = opcoes[language].indexOf(opcoes[language][0]) + 1;

    const pathBase = `${parent}.lithologies`;

    const lithologiesArray = values?.[parent]?.lithologies?.[index] ?? [];

    // Garante que o array `${parent}.lithologies[index]` sempre exista
    useEffect(() => {
        const currentLithologies = values?.[parent]?.lithologies ?? [];
        if (!Array.isArray(currentLithologies[index])) {
            const updatedLithologies = [...currentLithologies];
            updatedLithologies[index] = [];
            setFieldValue(`${parent}.lithologies`, updatedLithologies);
        }
    }, [index, parent, setFieldValue, values]);


    return (
        <View style={styles.container}>
            <FieldArray name={`${pathBase}[${index}]`}>
                {({ push, remove }) => (
                    <>
                        <View style={[GlobalStyles.row, styles.row]}>
                            <View style={GlobalStyles.col11}>
                                <Text style={styles.label}>
                                    {language === 'pt-BR' ? `Litologia` : `Lithology`}:
                                </Text>
                            </View>
                            <View style={[GlobalStyles.rightAligned]}>
                                <TouchableOpacity
                                    style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]}
                                    onPress={() => push({ depth_from: '', depth_to: '', lithology_type: '' })}
                                >
                                    <Icon name="plus" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {lithologiesArray.length === 0 ? (
                            <Text style={styles.emptyText}>
                                {language === 'pt-BR' ? `Nenhum item adicionado` : `No item found`}.
                            </Text>
                        ) : (
                            lithologiesArray.map((_, subIndex: number) => (
                                <View key={subIndex} style={[GlobalStyles.row, styles.row]}>
                                    <View style={[GlobalStyles.col2, { flexDirection: 'row' }]}>
                                        <NumericInput
                                            placeholder={language === 'pt-BR' ? `De` : `From`}
                                            value={lithologiesArray[subIndex]?.depth_from || (lithologiesArray[subIndex - 1]?.depth_to ? lithologiesArray[subIndex - 1]?.depth_to : start)}
                                            onChange={(text: String) =>
                                                setFieldValue(`${pathBase}[${index}][${subIndex}].depth_from`, text)
                                            }
                                            step={1}
                                            style={[GlobalStyles.input, styles.input]}
                                        />
                                    </View>

                                    <View style={[GlobalStyles.col2, { flexDirection: 'row' }]}>
                                        <NumericInput
                                            placeholder={language === 'pt-BR' ? `Até` : `To`}
                                            value={lithologiesArray[subIndex]?.depth_to || end}
                                            onChange={(text: string) =>
                                                setFieldValue(`${pathBase}[${index}][${subIndex}].depth_to`, text)
                                            }
                                            step={1}
                                            style={[GlobalStyles.input, styles.input]}
                                        />
                                    </View>

                                    <View style={{ flex: 1, marginRight: 3 }}>
                                        <View style={GlobalStyles.pickerContainer}>
                                            <Picker
                                                selectedValue={
                                                    lithologiesArray[subIndex]?.tipo || valorInicial
                                                }
                                                onValueChange={(itemValue) =>
                                                    setFieldValue(
                                                        `${pathBase}[${index}][${subIndex}].lithology_type`,
                                                        opcoes[language].indexOf(itemValue) + 1
                                                    )
                                                }
                                                style={GlobalStyles.picker}
                                            >
                                                {opcoes[language].map((val) => (
                                                    <Picker.Item key={val} label={`${val}`} value={`${val}`} />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>

                                    <View>
                                        <TouchableOpacity
                                            style={[GlobalStyles.warnButton, GlobalStyles.iconButton, { marginTop: 2 }]}
                                            onPress={() => remove(subIndex)}
                                        >
                                            <Icon name="trash" size={16} />
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
        flex: 1,
        margin: 0
    },
    label: { fontWeight: 'bold', flex: 1 },
    emptyText: {
        fontStyle: 'italic',
        color: '#777',
        marginVertical: 4,
        marginLeft: 4,
    }
});

export default EF_Lithology;
