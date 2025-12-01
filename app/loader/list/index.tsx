import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useLanguage } from '@/core/contexts/LanguageContext';
import { DataExporter } from "@/core/types/data-exporter";
import { DataInitializer } from "@/core/types/data-initializer";
import { DataReader } from "@/core/types/data-reader";
import { DataRemover } from "@/core/types/data-remover";
import { DataReseter } from "@/core/types/data-reseter";

import * as Exporters from "@/app-instance/scripts/export";
import * as Initializers from "@/app-instance/scripts/init";
import * as Readers from "@/app-instance/scripts/read";
import * as Removers from "@/app-instance/scripts/delete";
import * as Reseters from "@/app-instance/scripts/reset";

import DynamicList from '../../dynamic/list/index';
import { OperationModeProvider } from "@/core/contexts/OperationModeContext";

const ListLoader = () => {
    const { language } = useLanguage();
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    const exporterRegistry: Record<string, new (language: string) => DataExporter> = {
        ...Exporters,
    };
    const initializerRegistry: Record<string, new () => DataInitializer> = {
        ...Initializers,
    };
    const readerRegistry: Record<string, new (language: string) => DataReader> = {
        ...Readers,
    };
    const removerRegistry: Record<string, new (language: string) => DataRemover> = {
        ...Removers,
    };
    const reseterRegistry: Record<string, new () => DataReseter> = {
        ...Reseters,
    };

    const exporter = new exporterRegistry[schemaId + "Exporter"](language);
    const intializer = new initializerRegistry[schemaId + "Initializer"]();
    const reader = new readerRegistry[schemaId + "Reader"](language);
    const remover = new removerRegistry[schemaId + "Remover"](language);
    const reseter = new reseterRegistry[schemaId + "Reseter"]();

    return (
        <OperationModeProvider>
            <View style={{ flex: 1 }}>
                <DynamicList
                    schemaId={schemaId}
                    columns={reader.columns()}
                    onExport={exporter.export.bind(exporter)}
                    onExportPDF={exporter.exportPDF.bind(exporter)}
                    onExportAll={exporter.exportAll.bind(exporter)}
                    onInit={intializer.init.bind(intializer)}
                    onDelete={remover.remove.bind(remover)}
                    onList={reader.read.bind(reader)}
                    onReset={reseter.reset.bind(reseter)}
                />
            </View>
        </OperationModeProvider>
    );
};

export default ListLoader;