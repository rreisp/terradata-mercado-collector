import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import Section from './section';
import Icon from 'react-native-vector-icons/FontAwesome5'; // ou FontAwesome5, se quiser usar a versão 5
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';
import { useFormikContext } from 'formik';
import { CrudService } from '@/core/services/crud.service';
import { Option } from '@/core/types/option';

const EF_DepthResearch = ({ parent, editMode }: { parent: string, editMode: boolean }) => {
    const { language } = useLanguage();
    const { values, setFieldValue, validationSchema, validateForm } = useFormikContext();
    const [segmentIds, setSegmentIds] = useState<{ id: number }[]>([]);
    const [options, setOptions] = useState<Record<string, { id: number; value: string }[]>>({});

    const getOptions = async (table: string): Promise<Option[]> => {
        const lista = await CrudService.list<any>(table, [], [], language.replace("-", ""));
        const mapped = lista.map((item) => ({
            id: item.id,
            description: language === "pt-BR" ? item.ptBR : item.enUS
        }));

        return [
            { id: 0, description: language === 'pt-BR' ? 'Selecione' : 'Select' },
            ...mapped
        ];
    };

    async function loadOptions(keys: string[]) {
        const optionsObject: Record<string, Option[]> = {};

        for (const key of keys) {
            try {
                const result = await getOptions(key) as Option[];
                optionsObject[key] = result;
            } catch (error) {
                console.error(`Erro ao carregar opções de ${key}:`, error);
                optionsObject[key] = [];
            }
        }
        setOptions(optionsObject);
    }

    useEffect(() => {
        setSegmentIds(values?.[parent]?.segmentIds?.map(id => ({ id })));
    }, []);

    useEffect(() => {
        loadOptions([
            "moisture", 
            "hardness",
            "wash",
            "color", 
            "induration",
            "roundness",
            "min_grainsize",
            "max_grainsize",
            "lithology"
        ]);
    }, [language]);

    useEffect(() => {
        validateForm(values);
    }, [values]);

    const handleAddElement = () => {
        const id = Date.now();
        if (!segmentIds) {
            setSegmentIds([]);
        }
        setSegmentIds(prev => [...prev, { id }]);
        validateForm(values);
    };

    const handleRemoveElement = (id: number) => {
        const confirmAndRemove = () => {
            const index = segmentIds.findIndex(el => el.id === id);
            if (index !== -1) {
                // Crie um novo array de ids sem o elemento removido
                const newSegmentIds = segmentIds.filter((_, i) => i !== index);

                // Crie uma cópia do objeto ef_depth_test para modificá-lo
                const newEfDepthTest = { ...values.ef_depth_test };

                // Itere sobre as chaves de ef_depth_test
                for (const key in newEfDepthTest) {
                    const array = newEfDepthTest[key];
                    // Verifique se a propriedade é um array e remova o elemento
                    if (Array.isArray(array)) {
                        newEfDepthTest[key] = array.filter((_, i) => i !== index);
                    }
                }
                // Atualize o estado local dos ids
                setSegmentIds(newSegmentIds);
                // Atualize o Formik para refletir as mudanças em todos os arrays
                setFieldValue('ef_depth_test', newEfDepthTest);
            }
        };

        const msg = (language === 'pt-BR' ? `Tem certeza que deseja remover o segmento?` : `Are you sure you want to remove the segment?`);
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(msg);
            if (confirmed) confirmAndRemove();
        } else {
            Alert.alert(
                (language === 'pt-BR' ? `Confirmação` : `Confirmation`),
                msg,
                [
                    { text: (language === 'pt-BR' ? `Cancelar` : `Cancel`), style: 'cancel' },
                    { text: (language === 'pt-BR' ? `Remover` : `Delete`), style: 'destructive', onPress: confirmAndRemove }
                ],
                { cancelable: true }
            );
        }
    };

    return (
        <View>
            {!segmentIds || segmentIds.length === 0 ? (
                <Text style={styles.emptyText}>{language === 'pt-BR' ? `Nenhum segmento adicionado.` : `No segment added.`}</Text>
            ) : (
                segmentIds?.map((segment, index) => (
                    <View key={segment.id}>
                        <Section editMode={editMode} index={index} segmentId={segment.id} parent={parent} options={options} />
                        <View>
                            {index == segmentIds.length - 1 && index > 0 &&
                                <TouchableOpacity style={[(index == segmentIds.length - 1 ? GlobalStyles.warnButton : GlobalStyles.disabledButton), { marginVertical: 1 }]} onPress={() => handleRemoveElement(segment.id)} disabled={index !== segmentIds.length - 1}>
                                    <View style={GlobalStyles.row}>
                                        <Icon name="trash" size={16} color="#fff" style={styles.icon} />
                                        <Text style={styles.buttonText}>{language === 'pt-BR' ? `REMOVER SEGMENTO ${index + 1}` : `REMOVE SEGMENT ${index + 1}`}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                ))
            )}
            <View>
                <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleAddElement}>
                    <View style={GlobalStyles.row}>
                        <Icon name="plus" size={16} color="#fff" style={styles.icon} />
                        <Text style={styles.buttonText}>{language === 'pt-BR' ? `ADICIONAR SEGMENTO` : `ADD SEGMENT`}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        marginHorizontal: 16
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
        alignItems: 'center'
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#777',
        marginVertical: 4,
        marginLeft: 4,
    },
});

export default EF_DepthResearch;
