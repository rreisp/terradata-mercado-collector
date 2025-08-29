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

    const valorInicialTipo = opcoes[language].indexOf(opcoes[language][0]) + 1;
    const pathBase = `${parent}.lithologies`;
    const lithologiesArray = values?.[parent]?.lithologies?.[index] ?? [];

    // garante que o array `${parent}.lithologies[index]` sempre exista
    useEffect(() => {
        const currentLithologies = values?.[parent]?.lithologies ?? [];
        if (!Array.isArray(currentLithologies[index])) {
            const updatedLithologies = [...currentLithologies];
            updatedLithologies[index] = [{ from: start, to: end, type: valorInicialTipo }];
            setFieldValue(pathBase, updatedLithologies);
        }
    }, []);

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
                                    onPress={() => {
                                        // adiciona um novo item vazio sem alterar os anteriores
                                        push({
                                            from: null,
                                            to: null,
                                            type: valorInicialTipo
                                        });
                                    }}
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
                            lithologiesArray.map((item, subIndex: number) => (
                                <View key={subIndex} style={[GlobalStyles.row, styles.row]}>
                                    <View style={[GlobalStyles.col2, { flexDirection: 'row' }]}>
                                        <NumericInput
                                            placeholder={language === 'pt-BR' ? `De` : `From`}
                                            value={item.from}
                                            onChange={(text: string) => {
                                                setFieldValue(`${pathBase}[${index}][${subIndex}].from`, Number(text));
                                            }}
                                            step={1}
                                            style={[GlobalStyles.input, styles.input]}
                                        />
                                    </View>

                                    <View style={[GlobalStyles.col2, { flexDirection: 'row' }]}>
                                        <NumericInput
                                            placeholder={language === 'pt-BR' ? `Até` : `To`}
                                            value={item.to}
                                            onChange={(text: string) => {
                                                setFieldValue(`${pathBase}[${index}][${subIndex}].to`, Number(text));
                                                if (values?.[parent]?.lithologies?.[index][subIndex + 1]) {
                                                    setFieldValue(`${pathBase}[${index}][${subIndex + 1}].from`, Number(text));
                                                }
                                            }}
                                            step={1}
                                            style={[GlobalStyles.input, styles.input]}
                                        />
                                    </View>

                                    <View style={{ flex: 1, marginRight: 3 }}>
                                        <View style={GlobalStyles.pickerContainer}>
                                            <Picker
                                                selectedValue={opcoes[language][(item.type ?? valorInicialTipo) - 1]}
                                                onValueChange={(itemValue) =>
                                                    setFieldValue(
                                                        `${pathBase}[${index}][${subIndex}].type`,
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
