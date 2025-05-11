import { View, Text, Image, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { colors } from '../constants/colors';
import { Link } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GlobalStyles from '../constants/styles';

export default function Index() {
  return (
    <SafeAreaProvider>
      <View
        style={[GlobalStyles.container, styles.container]}
      >
        <SafeAreaView>
          <Image
            source={require('../assets/images/EnergyFuels-Logo.png')}
            style={[GlobalStyles.logo, { resizeMode: 'contain' }]}
          />
        </SafeAreaView>

        <Text style={[GlobalStyles.title, styles.title]}>
          CAPTURE<Text style={{ color: colors.grey }}>.WISE</Text>
        </Text>

        <Text style={GlobalStyles.textMuted}>
          POWERED BY TERRADATA
        </Text>

        <Link href="/tools" asChild>
          <Pressable style={styles.button} accessibilityRole="button">
            <Text style={styles.buttonText}>ACESSAR</Text>
          </Pressable>
        </Link>
      </View >
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    color: colors.green
  },
  button: {
    backgroundColor: colors.blue,
    width: '100%',
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 34,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold'
  }
})
