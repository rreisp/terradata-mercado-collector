import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { colors } from '../constants/colors';
import { Link } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaProvider>
      <View
        style={styles.container}
      >
        <Image
          source={require('../assets/images/react-logo.png')}
        />

        <Text style={styles.title}>
          CAPTURE<Text style={{ color: colors.white }}>.WISE</Text>
        </Text>

        <Text style={styles.text}>
          Captura de dados com eficiência e precisão.
        </Text>

        <Link href="/tools" asChild>
          <Pressable style={styles.button} accessibilityRole="button">
            <Text style={styles.buttonText}>LOGIN</Text>
          </Pressable>
        </Link>
      </View >
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.green
  },
  text: {
    fontSize: 13,
    color: colors.white,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8
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
