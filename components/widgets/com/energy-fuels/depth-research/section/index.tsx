import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome5'; // ou FontAwesome5, se quiser usar a versão 5

import EF_Clay from './clay';
import EF_Color from './color';
import EF_Notas from './comments';
import EF_Depth from './depth';
import EF_Grainsize from './grainsize';
import EF_Hardness from './hardness';
import EF_HMS from './hms';
import EF_Induration from './induration';
import EF_LithicFragments from './lithic-fragments';
import EF_Micah from './micah';
import EF_Moisture from './moisture';
import EF_OrganicMatter from './organic-matter';
import EF_Roundness from './roundness';
import EF_Recovery from './recovery';
import EF_Shells from './shells';
import EF_Sorting from './sorting';
import EF_Volume from './volume';
import EF_Wash from './wash';
import EF_Lithology from './lithology';
import { useLanguage } from '@/contexts/LanguageContext';
import { MultiCameraInput } from '@/components/widgets/input/multi-camera';
import { CrudService } from '@/services/crud.service';

const Section = ({ segmentId, editMode, index, size, parent }) => {
    const { language } = useLanguage();
    const [collapsed, setCollapsed] = useState(true);
    const { values, setFieldValue } = useFormikContext();

    const DEFAULT_START = 0;
    const DEFAULT_END = 100;

    const handleRemovePhoto = async (id: number) => {
        if (editMode) {
            try {
                await CrudService.delete(
                    "images",
                    "id = ?",
                    [id]
                );
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <View style={styles.bordered}>
            <TouchableOpacity onPress={() => setCollapsed(!collapsed)} style={(index % 2 == 0 ? styles.sectionHeaderEven : styles.sectionHeaderOdd)}>
                <View style={GlobalStyles.col3}>
                    <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Segmento ${index + 1}` : `Segment ${index + 1}`}</Text>
                </View>
                <View style={GlobalStyles.col8}>
                    <Text>{language === 'pt-BR' ? `de` : `from`} {index == 0 ? 0 : values?.[parent]?.depth?.[index]?.from}cm {language === 'pt-BR' ? `até` : `to`} {values?.[parent]?.depth?.[index]?.to || ''}cm</Text>
                </View>
                <View style={[GlobalStyles.col1, styles.right]}>
                    <Icon
                        name={collapsed ? 'chevron-down' : 'chevron-up'}
                        size={16}
                        color="#333"
                    />
                </View>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed}>
                <View key={segmentId} style={styles.sectionContent}>
                    <View style={GlobalStyles.fieldContainer}>
                        <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Fotos do segmento ${index + 1}` : `Photos from segment ${index + 1}`}:</Text>
                        <MultiCameraInput handleDelete={handleRemovePhoto} name={`${parent}.photos[${index}]`} />
                    </View>
                    <View style={GlobalStyles.row}>
                        <View style={GlobalStyles.col}>
                            <EF_Depth
                                index={index}
                                editable={index === size - 1}
                                parent={parent}
                            />
                        </View>
                    </View>

                    <View style={GlobalStyles.row}>
                        <View style={GlobalStyles.col}>
                            <EF_Recovery
                                index={index}
                                parent={parent}
                            />
                        </View>
                        <View style={GlobalStyles.col}>
                            <EF_Moisture
                                index={index}
                                parent={parent}
                            />
                        </View>
                    </View>

                    <View style={GlobalStyles.row}>
                        <View style={GlobalStyles.col}>
                            <EF_Volume
                                index={index}
                                parent={parent}
                            />
                        </View>
                        <View style={GlobalStyles.col}>
                            <EF_Hardness
                                index={index}
                                parent={parent}
                            />
                        </View>
                    </View>

                    <View style={GlobalStyles.row}>
                        <View style={GlobalStyles.col}>
                            <EF_Wash
                                index={index}
                                parent={parent}
                            />
                        </View>
                        <View style={GlobalStyles.col}>
                            <EF_Color
                                index={index}
                                parent={parent}
                            />
                        </View>
                    </View>

                    <View style={GlobalStyles.row}>
                        <View style={GlobalStyles.col}>
                            <EF_Induration
                                index={index}
                                parent={parent}
                            />
                        </View>
                        <View style={GlobalStyles.col}>
                            <EF_Grainsize
                                index={index}
                                parent={parent}
                            />
                        </View>
                    </View>

                    <View style={GlobalStyles.row}>
                        <View style={GlobalStyles.col}>
                            <EF_Sorting
                                index={index}
                                parent={parent}
                            />
                        </View>
                        <View style={GlobalStyles.col}>
                            <EF_Roundness
                                index={index}
                                parent={parent}
                            />
                        </View>
                    </View>

                    <View style={GlobalStyles.row}>
                        <View style={[GlobalStyles.col]}>
                            <EF_Clay
                                index={index}
                                parent={parent}
                            />
                        </View>

                        <View style={GlobalStyles.col}>
                            <EF_Micah
                                index={index}
                                parent={parent}
                            />
                        </View>
                    </View>

                    <View style={GlobalStyles.row}>
                        <View style={GlobalStyles.col}>
                            <EF_Shells
                                index={index}
                                parent={parent}
                            />
                        </View>

                        <View style={GlobalStyles.col}>
                            <EF_OrganicMatter
                                index={index}
                                parent={parent}
                            />
                        </View>
                    </View>

                    <View style={GlobalStyles.row}>
                        <View style={GlobalStyles.col}>
                            <EF_LithicFragments
                                index={index}
                                parent={parent}
                            />
                        </View>

                        <View style={GlobalStyles.col}>
                            <EF_HMS
                                index={index}
                                parent={parent}
                            />
                        </View>
                    </View>

                    <View style={GlobalStyles.row}>
                        <View style={GlobalStyles.col}>
                            <EF_Lithology
                                index={index}
                                parent={parent}
                                start={(index == 0 ? DEFAULT_START : values?.[parent]?.depth?.[index - 1].to)}
                                end={(Number(values?.[parent]?.depth?.[index] ? values?.[parent]?.depth?.[index].to :
                                    index == 0 ? DEFAULT_END : (Number(values?.[parent]?.depth?.[index - 1].to) + DEFAULT_END)))}
                            />
                        </View>
                    </View>

                    <View style={GlobalStyles.row}>
                        <View style={GlobalStyles.col}>
                            <EF_Notas
                                index={index}
                                parent={parent}
                            />
                        </View>
                    </View>
                </View>
            </Collapsible>
        </View>
    );
};
export default Section;

const styles = StyleSheet.create({
    bordered: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#eee'
    },
    sectionHeaderEven: {
        marginTop: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#cbf4f1',
        padding: 12,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    sectionHeaderOdd: {
        marginTop: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#b0efff',
        padding: 12,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    sectionContent: {
        padding: 0,
        backgroundColor: '#fefefe',
    },
    right: {
        alignContent: "flex-end"
    }
});
