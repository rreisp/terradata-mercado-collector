// components/layout/SafeAreaContainer.tsx
import React from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { View, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import GlobalStyles from "@/constants/styles";

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
                <ScrollView
                    style={[GlobalStyles.container, styles.fill]}
                    contentContainerStyle={GlobalStyles.scrollContainer}
                >
                    {children}
                </ScrollView>
            ) : (
                // <View style={[styles.fill, { paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }]}>
                //     {children}
                // </View>
                <View
                    style={[GlobalStyles.container, styles.fill]}
                >
                    {children}
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        padding: 3
    },
});

export default SafeAreaContainer;
