import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DataExporter } from "@/core/types/data-exporter";
import { DataReader } from "@/core/types/data-reader";
import { DataRemover } from "@/core/types/data-remover";
import { DataReseter } from "@/core/types/data-reseter";

import * as Exporters from "@/app-instance/scripts/export";
import * as Readers from "@/app-instance/scripts/read";
import * as Removers from "@/app-instance/scripts/delete";
import * as Reseters from "@/app-instance/scripts/reset";

import DynamicList from '../../dynamic/list/index';
import { OperationModeProvider } from "@/core/contexts/OperationModeContext";

const ListLoader = () => {
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    const exporterRegistry: Record<string, new () => DataExporter> = {
        ...Exporters,
    };
    const readerRegistry: Record<string, new () => DataReader> = {
        ...Readers,
    };
    const removerRegistry: Record<string, new () => DataRemover> = {
        ...Removers,
    };
    const reseterRegistry: Record<string, new () => DataReseter> = {
        ...Reseters,
    };

    const exporter = new exporterRegistry[schemaId + "Exporter"]();
    const reader = new readerRegistry[schemaId + "Reader"]();
    const remover = new removerRegistry[schemaId + "Remover"]();
    const reseter = new reseterRegistry[schemaId + "Reseter"]();

    return (
        <OperationModeProvider>
            <View style={{ flex: 1 }}>
                <DynamicList
                    schemaId={schemaId}
                    columns={reader.columns()}
                    onExport={exporter.export.bind(exporter)}
                    onExportAll={exporter.exportAll.bind(exporter)}
                    onDelete={remover.remove.bind(remover)}
                    onList={reader.read.bind(reader)}
                    onReset={reseter.reset.bind(reseter)}
                />
            </View>
        </OperationModeProvider>
    );
};

export default ListLoader;