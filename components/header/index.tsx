import {
    Platform,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import { IconButton } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

interface HeaderProps {
    step: string;
    title: string;
}

export function Header({ step, title }: HeaderProps) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* <View style={styles.row}>
                    <Pressable onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color="#000" />
                    </Pressable>
                    <Text style={styles.text}>
                        {step}<Feather name="loader" size={16} color="#000" />
                    </Text>
                </View> */}
                {/* <Text style={styles.title}>{title}</Text> */}
                {/* <Pressable style={styles.iconButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </Pressable>

                <Pressable style={styles.iconButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </Pressable> */}

                <IconButton icon={props => <Icon name="format-list-bulleted-type" {...props} />} />
                <IconButton icon={props => <Icon name="wifi" {...props} />} />
                <IconButton
                    icon={props => <Icon name="account" {...props} />}
                    color="primary"
                />

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderBottomRightRadius: 14,
        borderBottomLeftRadius: 14,
        marginBottom: 14,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 34 : 34
    },
    content: {
        paddingLeft: 96,
        paddingRight: 96,
        paddingBottom: 34,
        borderBottomRightRadius: 14,
        borderBottomLeftRadius: 14,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between"
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center'
    },
    text: {
        fontSize: 18
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.background
    },
    iconButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.background,
        borderRadius: 4,
        padding: 4,
        width: 33,
        height: 33
    }
}) 