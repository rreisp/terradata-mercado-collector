import { View, Text, Image, Pressable, StyleSheet, SafeAreaView, ActivityIndicator, StatusBar } from "react-native";
import { colors } from '../constants/colors';
import { values } from '../constants/values';
import { Link } from 'expo-router';
import GlobalStyles from '../constants/styles';
import CountryFlag from "react-native-country-flag";
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from "react";

export default function Index() {
  const { setLanguage } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), values.delay);
    return () => clearTimeout(timer);
  }, []);

  const escolherIdioma = (lang: 'pt-BR' | 'en-US') => {
    setLanguage(lang);
  };

  return (
    <>
      {loading &&
        <View style={GlobalStyles.centered}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      }
      {!loading &&
          <View
            style={[GlobalStyles.container, styles.container ]}
          >
            <StatusBar hidden={true} />
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
      }
    </>
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
    // textShadow: "1px 1px 2px #777",    
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 7
  }
})
