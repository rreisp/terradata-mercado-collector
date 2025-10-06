// components/layout/SafeAreaContainer.tsx
import React from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
    View,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
// 💡 Importamos o componente da biblioteca externa
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; 

import { colors } from "@/core/constants/colors";
import GlobalStyles from "@/core/constants/styles";

type SafeAreaContainerProps = {
    children: React.ReactNode;
    isLoading?: boolean;
    scrollable?: boolean;
};

const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
    children,
    isLoading = false,
    scrollable = true,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {isLoading ? (
                <View style={GlobalStyles.centered}>
                    <ActivityIndicator size="large" color={colors.blue} />
                </View>
            ) : scrollable ? (
                // ✅ SUBSTITUINDO ScrollView por KeyboardAwareScrollView
                <KeyboardAwareScrollView
                    // Estilos do seu antigo ScrollView
                    style={[GlobalStyles.container, styles.fill]}
                    contentContainerStyle={GlobalStyles.scrollContainer}
                    
                    // Props específicas que melhoram a experiência
                    enableOnAndroid={true} // Ativa o suporte adequado no Android
                    extraScrollHeight={180} // Adiciona um pequeno "buffer" (espaço extra) para o campo focado
                    showsVerticalScrollIndicator={false}
                    
                    // Propriedades úteis para integração com formulários
                    // keyboardShouldPersistTaps="handled" // Útil para garantir que o tap nos inputs não feche o teclado (opcional)
                >
                    {children}
                </KeyboardAwareScrollView>
            ) : (
                <View style={[GlobalStyles.container, styles.fill]}>
                    {children}
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        padding: 3,
    },
});

export default SafeAreaContainer;