import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/types/root-stack-param-list';
import { useLocalSearchParams } from "expo-router";
import DynamicForm from '@/app/dynamic/form';
import { OperationModeProvider } from '@/contexts/OperationModeContext';

type FormLoaderRouteProp = RouteProp<RootStackParamList, 'loader/form/index'>;

const extract = (info: any) => {
    console.log(info);
    console.warn('Extract Info');
    const drilling = extractDrillingInfo(info);
    console.log(drilling);
    const drillingIntervals = extractDrillingIntervalInfo(info);
    console.log(drillingIntervals);
    const intervalsLithologies = extractIntervalsLithologyInfo(info);
    console.log(intervalsLithologies);
};


const extractDrillingInfo = (info: any) => {
    return {
        drilling_id: info.perfuracao_id,
        easting: info.easting,
        northing: info.northing,
        elevation: info.elevation,
        tenement: info.tenement,
        landowner: info.landowner,
        start_date: info.ef_dates.start,
        end_date: info.ef_dates.end,
        reason: info.reason
    }
};

const extractDrillingIntervalInfo = (info: any) => {
    const size = info.ef_depth_test.depth?.length || 0;
    let intervals = [];
    for (let i = 0; i < size; i++) {
        let obj = {
            depthFrom: info.ef_depth_test.depth[i].from,
            depthTo: info.ef_depth_test.depth[i].to,
            recovery: info.ef_depth_test.runCoreRecovery[i],
            moisture: info.ef_depth_test.moisture[i],
            volume: info.ef_depth_test.volume[i],
            hardness: info.ef_depth_test.hardness[i],
            wash: info.ef_depth_test.wash[i],
            color: info.ef_depth_test.color[i],
            induration: info.ef_depth_test.induration[i],
            grainsize: info.ef_depth_test.grainsize[i],
            sorting: info.ef_depth_test.sorting[i],
            roundness: info.ef_depth_test.roundness[i],
            clay: info.ef_depth_test.clayPct[i],
            micah: info.ef_depth_test.micahPct[i],
            shells: info.ef_depth_test.shellsPct[i],
            organicMatter: info.ef_depth_test.organicMatterPct[i],
            lithicFragments: info.ef_depth_test.lithicFragmentsPct[i],
            hms: info.ef_depth_test.hms[i],
            comments: info.ef_depth_test.comments[i]
        };

        intervals.push(obj);
    }
    return intervals;
};

const extractIntervalsLithologyInfo = (info: any) => {
    console.log(info.ef_depth_test.lithologies);
};

const FormLoader = () => {
    const route = useRoute<FormLoaderRouteProp>();
    // const route = useRoute();
    const formIdParam = useLocalSearchParams().formId;
    const formId = typeof formIdParam === 'string'
        ? formIdParam
        : Array.isArray(formIdParam)
            ? formIdParam[0]
            : String(formIdParam);
    // const formId = route.params?.formId;

    console.warn(formId);

    return (
        <OperationModeProvider>
            <DynamicForm schemaId={formId} />
        </OperationModeProvider>
    );
};

export default FormLoader;