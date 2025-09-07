import { useLocalSearchParams } from "expo-router";
import DynamicList from '../../dynamic/list/index';
import { OperationModeProvider } from "@/core/contexts/OperationModeContext";
import { View } from "react-native";
import { DataRemover } from "@/core/types/data-remover";
import { EnergyFuelsDrillingRemover } from "@/app-instance/scripts/delete/energy-fuels.perfuracao.remover";
import { EnergyFuelsDrillingReseter } from "@/app-instance/scripts/reset/energy-fuels.perfuracao.reseter";
import { DataReseter } from "@/core/types/data-reseter";

const ListLoader = () => {
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    const remover: DataRemover = new EnergyFuelsDrillingRemover();
    const reseter: DataReseter = new EnergyFuelsDrillingReseter();

    return (
        <OperationModeProvider>
            <View style={{ flex: 1}}>
                <DynamicList schemaId={schemaId} onDelete={remover.remove.bind(remover)} onReset={reseter.reset.bind(reseter)}/>
            </View>
        </OperationModeProvider>
    );
};

export default ListLoader;