import { View, Text, Image, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { colors } from '../constants/colors';
import { Link } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GlobalStyles from '../constants/styles';
import CountryFlag from "react-native-country-flag";
import { useLanguage } from '../contexts/LanguageContext';

export default function Index() {
  const { setLanguage } = useLanguage();

  const escolherIdioma = (lang: 'pt-BR' | 'en-US') => {
    setLanguage(lang);
  };

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
          FIELD<Text style={{ color: colors.grey }}>COLLECTOR</Text>
        </Text>

        <Text style={GlobalStyles.textMuted}>
          POWERED BY CAPTUREWISE
        </Text>

        <View style={[GlobalStyles.row, styles.row]}>
          <View style={GlobalStyles.col}>
            <Link href="/tools" asChild>
              <Pressable style={styles.button} accessibilityRole="button" onPress={() => escolherIdioma('pt-BR')}>
                <CountryFlag isoCode="br" size={25} />
                <Text style={styles.buttonText}>ACESSAR</Text>
              </Pressable>
            </Link>
          </View>
          <View style={GlobalStyles.col}>
            <Link href="/tools" asChild>
              <Pressable style={styles.button} accessibilityRole="button" onPress={() => escolherIdioma('en-US')}>
                <CountryFlag isoCode="us" size={25} />
                <Text style={styles.buttonText}>ENTER</Text>
              </Pressable>
            </Link>
          </View>
        </View>
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
  row: {
    width: '33%',
    marginTop: 27
  },
  title: {
    color: colors.green,
  },
  button: {
    width: '100%',
    height: 69,
    borderWidth: 1,
    borderColor: "#efefef",
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 34,
  },
  buttonText: {
    color: "#777",
    textShadowRadius: 1,
    textShadowColor: '#777',
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 7
  }
})
