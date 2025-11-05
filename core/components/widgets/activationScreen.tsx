import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { verifyLicense } from '@/core/services/license.service'; 

// Esta prop 'onLicenseVerified' será a função do App.js
export default function ActivationScreen({ onLicenseVerified }) {
  const [licenseKey, setLicenseKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActivate = async () => {
    if (isProcessing) return;
    if (licenseKey.trim() === '') {
      Alert.alert('Erro', 'Por favor, cole a chave da licença no campo.');
      return;
    }

    setIsProcessing(true);

    const result = await verifyLicense(licenseKey.trim());

    if (result.valid) {
      // Sucesso! O App.js será notificado
      Alert.alert('Licença Ativada!', result.message, [
        { text: 'OK', onPress: () => onLicenseVerified() },
      ]);
    } else {
      // Falha
      Alert.alert('Falha na Ativação', result.message, [
        { text: 'Tentar Novamente', onPress: () => setIsProcessing(false) },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Ativar Licença</Text>
        <Text style={styles.instructions}>
          Copie a chave da licença (obtida pelo QR Code) e cole-a no campo
          abaixo.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Cole sua chave de licença aqui"
          value={licenseKey}
          onChangeText={setLicenseKey}
          multiline={true}
          autoCapitalize="none"
          editable={!isProcessing} // Desativa o input enquanto processa
        />

        <TouchableOpacity
          style={[styles.button, isProcessing && styles.buttonDisabled]}
          onPress={handleActivate}
          disabled={isProcessing}>
          {isProcessing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Ativar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    minHeight: 100, // Bom espaço para uma chave longa
    textAlignVertical: 'top', // Para Android
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a9a9a9',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});