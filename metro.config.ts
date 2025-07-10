const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permitir arquivos .wasm
config.resolver.assetExts.push('wasm');

module.exports = config;
