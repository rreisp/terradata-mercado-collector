import { p256 } from '@noble/curves/p256';
import { sha256 } from '@noble/hashes/sha256';
import { decode } from 'base-64';
import { PUBLIC_KEY_HEX } from '../config/cryptoConfig.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUS_KEY = '@license_status';
const LAST_CHECK_KEY = '@license_last_check';
const EXP_DATE_KEY = '@license_exp_date';

function base64UrlToUint8Array(base64UrlStr) {

  const base64 = base64UrlStr.replace(/-/g, '+').replace(/_/g, '/');
  

  const binaryString = decode(base64);

  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function stringToUint8Array(str) {
  return new TextEncoder().encode(str);
}

async function checkClockTampering() {
  try {
    const lastCheckStr = await AsyncStorage.getItem(LAST_CHECK_KEY);
    const currentDate = new Date();

    if (!lastCheckStr) {
      await AsyncStorage.setItem(LAST_CHECK_KEY, currentDate.toISOString());
      return true; 
    }
    
    const lastCheckDate = new Date(lastCheckStr);  

    // Permite uma "folga" de 5 minutos PARA TRÁS,
    // para casos de dessincronia de relógio ou pequenos ajustes.
    // O relógio do usuário pode estar 5 minutos "atrasado" em 
    // relação à última checagem, e ainda será válido.
    const fiveMinutesBeforeLastCheck = new Date(lastCheckDate.getTime() - 5 * 60000);

    if (currentDate >= fiveMinutesBeforeLastCheck) {
      if (currentDate > lastCheckDate) {
        await AsyncStorage.setItem(LAST_CHECK_KEY, currentDate.toISOString());
      }
      return true; 
    } else {
      return false; 
    }

  } catch (e) {
    console.error("Erro no check de relógio:", e);
    return false; 
  }
}

function hexToUint8Array(hexStr) {
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
    
    const clockOk = await checkClockTampering();
    if (!clockOk) {
      return { valid: false, message: 'Data do sistema inválida. Por favor, corrija o relógio e tente novamente.' };
    }

  
    const parts = productKey.split('---');
    if (parts.length !== 2) {
      return { valid: false, message: 'Formato da chave inválido.' };
    }
    const [encodedPayload, encodedSignature] = parts;

     const payloadBytes = base64UrlToUint8Array(encodedPayload);

    const signatureBytes = base64UrlToUint8Array(encodedSignature);
    

    const payloadHash = sha256(payloadBytes);

    const publicKeyBytes = hexToUint8Array(PUBLIC_KEY_HEX);
    const isValid = p256.verify(signatureBytes, payloadHash, publicKeyBytes);

    if (!isValid) {
      return { valid: false, message: 'Assinatura inválida. Chave falsificada ou corrompida.' };
    }

    const payloadStr = new TextDecoder().decode(payloadBytes);
    const licenseData = JSON.parse(payloadStr);

    // const expirationDate = new Date(licenseData.exp);
    const partsDate = licenseData.exp.split('-');
    const expirationDate = new Date(partsDate[0], partsDate[1] - 1, partsDate[2]);
    const today = new Date();

    expirationDate.setHours(23, 59, 59, 999); // Válido até o fim do dia
    today.setHours(0, 0, 0, 0);
    
    if (expirationDate < today) {
      return { valid: false, message: `Licença expirada em ${licenseData.exp}.` };
    }

    await AsyncStorage.setItem(STATUS_KEY, 'LICENSED');
    await AsyncStorage.setItem(EXP_DATE_KEY, licenseData.exp);
    
    return { valid: true, message: `Licença válida até ${licenseData.exp}.`};

  } catch (error) {
    console.error('Erro ao verificar licença:', error);
    return { valid: false, message: 'Erro inesperado ao processar a licença.' };
  }
}


export async function getLicenseStatus() {
  try {
    const status = await AsyncStorage.getItem(STATUS_KEY);
    if (status !== 'LICENSED') {
      return { licensed: false };
    }

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
      await AsyncStorage.removeItem(STATUS_KEY);
      await AsyncStorage.removeItem(EXP_DATE_KEY);
      return { licensed: false, message: 'Sua licença expirou.' };
    }
  
    return { licensed: true, expiration: expDateStr };

  } catch (e) {
    return { licensed: false, message: 'Erro ao ler status da licença.' };
  }
}