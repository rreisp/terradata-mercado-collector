import { p256 } from '@noble/curves/p256'; // P-256 é a curva secp256r1
import { sha256 } from '@noble/hashes/sha256';
import { decode } from 'base-64'; // Biblioteca para decodificar Base64
import { PUBLIC_KEY_HEX } from '../config/cryptoConfig.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves para o AsyncStorage
const STATUS_KEY = '@license_status';
const LAST_CHECK_KEY = '@license_last_check';
const EXP_DATE_KEY = '@license_exp_date';

/**
 * Converte uma string Base64-URL-safe (usada pelo PHP) 
 * para um Uint8Array (array de bytes) que a biblioteca de criptografia entende.
 */
function base64UrlToUint8Array(base64UrlStr) {
  // 1. Converte de URL-safe (-, _) para Base64 padrão (+, /)
  const base64 = base64UrlStr.replace(/-/g, '+').replace(/_/g, '/');
  
  // 2. Decodifica a string base64 para uma string binária
  const binaryString = decode(base64);
  
  // 3. Converte a string binária em um array de bytes
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Converte uma string de texto (como o payload JSON) para Uint8Array.
 */
function stringToUint8Array(str) {
  return new TextEncoder().encode(str);
}

/**
 * [ANTI-FRAUDE] Verifica se o usuário não moveu o relógio para trás.
 */
async function checkClockTampering() {
  try {
    const lastCheckStr = await AsyncStorage.getItem(LAST_CHECK_KEY);
    const currentDate = new Date();

    if (!lastCheckStr) {
      // Primeira verificação de todas, armazena a data atual
      await AsyncStorage.setItem(LAST_CHECK_KEY, currentDate.toISOString());
      return true; // OK
    }
    
    const lastCheckDate = new Date(lastCheckStr);

    // Adiciona uma "gordura" de 5 minutos para evitar falsos positivos
    // (ex: acerto de fuso horário)
    const fiveMinutesAgo = new Date(currentDate.getTime() - 5 * 60000);

    if (fiveMinutesAgo < lastCheckDate) {
      // OK, a data atual é maior ou um pouco menor que a última.
      // Atualiza a data da última verificação para a data atual, se ela for maior
      if(currentDate > lastCheckDate) {
         await AsyncStorage.setItem(LAST_CHECK_KEY, currentDate.toISOString());
      }
      return true;
    } else {
      // FRAUDE! O relógio do sistema foi movido para trás.
      return false; 
    }

  } catch (e) {
    console.error("Erro no check de relógio:", e);
    return false; // Falha segura
  }
}

function hexToUint8Array(hexStr) {
  // Remove o prefixo '04' se ele for o padrão,
  // mas a chave pública completa (65 bytes) já deve ser usada.
  // Apenas garantindo que o hex tenha um número par de caracteres.
  if (hexStr.length % 2 !== 0) {
    console.error("String hex inválida");
    return new Uint8Array();
  }
  
  const bytes = new Uint8Array(hexStr.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexStr.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Função principal que valida a chave do produto lida do QR Code.
 */
export async function verifyLicense(productKey) {
  try {
    // 1. Verifica o relógio
    const clockOk = await checkClockTampering();
    if (!clockOk) {
      return { valid: false, message: 'Data do sistema inválida. Por favor, corrija o relógio e tente novamente.' };
    }

    // 2. Divide os dados e a assinatura
    const parts = productKey.split('---');
    if (parts.length !== 2) {
      return { valid: false, message: 'Formato da chave inválido.' };
    }
    const [encodedPayload, encodedSignature] = parts;

    // 3. Decodifica os dados
    // O payload (JSON) é decodificado para bytes
    const payloadBytes = base64UrlToUint8Array(encodedPayload);
    // A assinatura (binária) é decodificada para bytes
    const signatureBytes = base64UrlToUint8Array(encodedSignature);
    
    // 4. Calcula o hash dos dados (payload)
    // A assinatura é feita sobre o HASH do payload
    const payloadHash = sha256(payloadBytes);

    // 5. VERIFICA A ASSINATURA
    // Compara a assinatura, o hash do payload e a chave pública
    const publicKeyBytes = hexToUint8Array(PUBLIC_KEY_HEX);
    const isValid = p256.verify(signatureBytes, payloadHash, publicKeyBytes);

    if (!isValid) {
      return { valid: false, message: 'Assinatura inválida. Chave falsificada ou corrompida.' };
    }

    // 6. A assinatura é VÁLIDA. Agora, verificamos o conteúdo.
    // Converte os bytes do payload de volta para uma string JSON
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const licenseData = JSON.parse(payloadStr);

    // 7. Verifica a data de expiração
    const expirationDate = new Date(licenseData.exp);
    const today = new Date();

    // Zera as horas para comparar apenas as datas
    expirationDate.setHours(23, 59, 59, 999); // Válido até o fim do dia
    today.setHours(0, 0, 0, 0);
    
    if (expirationDate < today) {
      return { valid: false, message: `Licença expirada em ${licenseData.exp}.` };
    }

    // 8. TUDO CERTO! Licença válida.
    // Salva o status de licenciado para não pedir de novo
    await AsyncStorage.setItem(STATUS_KEY, 'LICENSED');
    await AsyncStorage.setItem(EXP_DATE_KEY, licenseData.exp);
    
    return { valid: true, message: `Licença válida até ${licenseData.exp}.`};

  } catch (error) {
    console.error('Erro ao verificar licença:', error);
    return { valid: false, message: 'Erro inesperado ao processar a licença.' };
  }
}

/**
 * Função para verificar o status da licença (ex: na abertura do app)
 */
export async function getLicenseStatus() {
  try {
    const status = await AsyncStorage.getItem(STATUS_KEY);
    if (status !== 'LICENSED') {
      return { licensed: false };
    }

    // Se está licenciado, faz as checagens de relógio e expiração
    const clockOk = await checkClockTampering();
    if (!clockOk) {
      return { licensed: false, message: 'Data do sistema inválida. Por favor, corrija o relógio.' };
    }

    const expDateStr = await AsyncStorage.getItem(EXP_DATE_KEY);
    const expirationDate = new Date(expDateStr);
    const today = new Date();
    
    expirationDate.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);

    if (expirationDate < today) {
      // A licença expirou, limpa o status
      await AsyncStorage.removeItem(STATUS_KEY);
      await AsyncStorage.removeItem(EXP_DATE_KEY);
      return { licensed: false, message: 'Sua licença expirou.' };
    }
    
    // Tudo certo, usuário licenciado e dentro da validade
    return { licensed: true, expiration: expDateStr };

  } catch (e) {
    return { licensed: false, message: 'Erro ao ler status da licença.' };
  }
}