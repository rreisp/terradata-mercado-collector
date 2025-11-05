import { 
  View, 
  Text, 
  Image, 
  Pressable, 
  StyleSheet, 
  ActivityIndicator, // --- NOVO ---
  Alert               // --- NOVO ---
} from "react-native";
import { colors } from '@/core/constants/colors';
import { constants } from '@/core/constants/constants';
import { Link } from 'expo-router';
import GlobalStyles from '@/core/constants/styles';
import CountryFlag from "react-native-country-flag";
import { useLanguage } from '@/core/contexts/LanguageContext';
import { useEffect, useState } from "react";
import SafeAreaContainer from "@/core/components/safe-container";

import * as Initializers from "@/app-instance/scripts/init";

// --- NOVOS IMPORTS DO SISTEMA DE LICENÇA ---
// (Ajuste os caminhos se eles estiverem em locais diferentes)
import { getLicenseStatus } from "@/core/services/license.service";
import ActivationScreen from "@/core/components/widgets/activationScreen"; 
// ---------------------------------------------

export default function Index() {
  const { setLanguage } = useLanguage();

  // --- STATES ALTERADOS ---
  // Renomeamos 'loading' para ser mais específico
  const [isCheckingLicense, setIsCheckingLicense] = useState(true);
  // Novo state para controlar se o app está licenciado
  const [isLicensed, setIsLicensed] = useState(false);
  // -------------------------

  // --- USEEFFECT ALTERADO ---
  // Agora ele verifica a licença E roda seus initializers
  useEffect(() => {
    const initializeAndCheckLicense = async () => {
      // 1. Verifica o status da licença
      const status = await getLicenseStatus();

      if (status.licensed) {
        setIsLicensed(true);
        
        // 2. Roda seus initializers (pois o usuário é válido)
        Object.entries(Initializers).forEach(([className, ClassRef]) => {
          const initializer = new (ClassRef as any)();
          initializer.init();
        });
      } else {
        setIsLicensed(false);
        // 3. Se houver uma mensagem (ex: erro de relógio), mostra
        if (status.message) {
          Alert.alert("Aviso", status.message);
        }
      }
      
      // 4. Termina o carregamento
      setIsCheckingLicense(false);
    };

    initializeAndCheckLicense();

    // Removemos o timer e a limpeza, pois o check de licença já
    // controla o fim do "loading"
  }, []); // Roda apenas uma vez na inicialização

  const escolherIdioma = (lang: 'pt-BR' | 'en-US') => {
    setLanguage(lang);
  };

  // --- LÓGICA DE RENDERIZAÇÃO CONDICIONAL ---

  // 1. Enquanto estiver verificando, mostra um "carregando"
  if (isCheckingLicense) {
    return (
      <SafeAreaContainer>
        <View style={[GlobalStyles.container, GlobalStyles.centered]}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={[GlobalStyles.textMuted, { marginTop: 20 }]}>
            Verificando licença...
          </Text>
        </View>
      </SafeAreaContainer>
    );
  }

  // 2. Se não estiver licenciado, mostra a tela de Ativação
  if (!isLicensed) {
    return (
      <ActivationScreen 
        onLicenseVerified={() => {
          // Esta função é chamada pela ActivationScreen quando
          // o usuário ativa com sucesso.
          setIsLicensed(true);
          
          // Roda os initializers pela primeira vez
          Object.entries(Initializers).forEach(([className, ClassRef]) => {
            const initializer = new (ClassRef as any)();
            initializer.init();
          });
        }} 
      />
    );
  }

  // 3. Se passou em tudo (está licenciado), mostra sua tela de idioma
  return (
    <SafeAreaContainer>
      <View
        style={[GlobalStyles.container, GlobalStyles.centered]}
      >
        <Image
          source={require('../assets/images/capturewise.png')}
          style={[GlobalStyles.logo, { resizeMode: 'contain' }]}
        />

        <Text style={[GlobalStyles.title, styles.title]}>
          CAPTURE<Text style={{ color: colors.grey }}>WISE</Text>
        </Text>

        <Text style={GlobalStyles.textMuted}>
          POWERED BY TERRADATA
        </Text>

        <View style={[GlobalStyles.row, styles.row]}>
          <View style={GlobalStyles.col6}>
            <Link href="/tools" asChild>
              <Pressable style={styles.button} accessibilityRole="button" onPress={() => escolherIdioma('pt-BR')}>
                <CountryFlag isoCode="br" size={25} />
                <Text style={styles.buttonText}>ACESSAR</Text>
              </Pressable>
            </Link>
          </View>
          <View style={GlobalStyles.col6}>
            <Link href="/tools" asChild>
              <Pressable style={styles.button} accessibilityRole="button" onPress={() => escolherIdioma('en-US')}>
                <CountryFlag isoCode="us" size={25} />
                <Text style={styles.buttonText}>ENTER</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View >
    </SafeAreaContainer>
  );
}

// Seus estilos (sem alteração)
const styles = StyleSheet.create({
  row: {
    width: '50%',
  },
  title: {
    color: colors.green,
  },
  button: {
    width: '100%',
    height: 69,
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
});