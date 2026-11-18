import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useLanguage } from '@/core/contexts/LanguageContext';
import { DataExporter } from "@/core/types/data-exporter";
import { DataInitializer } from "@/core/types/data-initializer";
import { DataReader } from "@/core/types/data-reader";
import { DataRemover } from "@/core/types/data-remover";
import { DataReseter } from "@/core/types/data-reseter";
import { DataImporter } from "@/core/types/data-importer";

import * as Exporters from "@/app-instance/scripts/export";
import * as Importers from "@/app-instance/scripts/import";
import * as Initializers from "@/app-instance/scripts/init";
import * as Readers from "@/app-instance/scripts/read";
import * as Removers from "@/app-instance/scripts/delete";
import * as Reseters from "@/app-instance/scripts/reset";

import DynamicList from '../../dynamic/list/index';
import { OperationModeProvider } from "@/core/contexts/OperationModeContext";
import GlobalStyles from '@/core/constants/styles';

const ListLoader = () => {
    const { language } = useLanguage();
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    // Se o schemaId ainda não estiver disponível, exibe um loading ou vazio para evitar quebras
    if (!schemaId) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    const exporterRegistry: Record<string, new (language: string) => DataExporter> = { ...Exporters };
    const importerRegistry: Record<string, new (language: string) => DataImporter> = { ...Importers };
    const initializerRegistry: Record<string, new () => DataInitializer> = { ...Initializers };
    const readerRegistry: Record<string, new (language: string) => DataReader> = { ...Readers };
    const removerRegistry: Record<string, new (language: string) => DataRemover> = { ...Removers };
    const reseterRegistry: Record<string, new () => DataReseter> = { ...Reseters };

    // ***************************************************************************************
    // Verificação de segurança opcional para alertar ausência de classes
    const ImporterClass = importerRegistry[schemaId + "Importer"];
    const ExporterClass = exporterRegistry[schemaId + "Exporter"];
    const InitializerClass = initializerRegistry[schemaId + "Initializer"];
    const ReaderClass = readerRegistry[schemaId + "Reader"];
    const RemoverClass = removerRegistry[schemaId + "Remover"];
    const ReseterClass = reseterRegistry[schemaId + "Reseter"];

    const renderErroSchemaNaoEncontrado = (schemaId: string, script: string) => (
        <View style={GlobalStyles.errorContainer}>
            <View style={GlobalStyles.errorBox}>
                <Text style={GlobalStyles.errorText}>
                    Erro: Script "{script}" não encontrado para o schema "{schemaId}".
                </Text>
            </View>
        </View>
    );

    if (!ImporterClass) { return (renderErroSchemaNaoEncontrado(schemaId, "Importer")); }
    if (!ExporterClass) { return (renderErroSchemaNaoEncontrado(schemaId, "Exporter")); }
    if (!InitializerClass) { return (renderErroSchemaNaoEncontrado(schemaId, "Initializer")); }
    if (!ReaderClass) { return (renderErroSchemaNaoEncontrado(schemaId, "Reader")); }
    if (!RemoverClass) { return (renderErroSchemaNaoEncontrado(schemaId, "Remover")); }
    if (!ReseterClass) { return (renderErroSchemaNaoEncontrado(schemaId, "Reseter")); }

    // ***************************************************************************************    

    const importer = new ImporterClass(language);
    const exporter = new ExporterClass(language);
    const initializer = InitializerClass ? new InitializerClass() : null;
    const reader = new ReaderClass(language);
    const remover = new RemoverClass(language);
    const reseter = ReseterClass ? new ReseterClass() : null;

    return (
        <OperationModeProvider>
            <View style={{ flex: 1 }}>
                <DynamicList
                    schemaId={schemaId}
                    columns={reader.columns()}
                    onExport={exporter.export.bind(exporter)}
                    onExportPDF={exporter.exportPDF?.bind(exporter)}
                    onExportAll={exporter.exportAll?.bind(exporter)}
                    onImportDatabase={importer.importDatabase.bind(importer)}
                    onInit={initializer?.init.bind(initializer)}
                    onDelete={remover.remove.bind(remover)}
                    onList={reader.read.bind(reader)}
                    onReset={reseter?.reset.bind(reseter)}
                    onExportDatabase={async () => {
                        throw new Error("Function not implemented.");
                    }}
                />
            </View>
        </OperationModeProvider>
    );
};

export default ListLoader;