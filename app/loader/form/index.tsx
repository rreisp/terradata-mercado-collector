import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/types/root-stack-param-list';
import { useLocalSearchParams } from "expo-router";
import DynamicForm from '@/app/dynamic/form';
import { OperationModeProvider } from '@/contexts/OperationModeContext';
// import RNFS from 'react-native-fs';

// base64ToFile.ts
export async function base64ToFile(
    base64Data: string,
    contentType = 'image/jpeg',
    fileName = 'file.jpg'
): Promise<Blob | { uri: string; name: string; type: string }> {
    const cleanedBase64 = base64Data.replace(/^data:\w+\/\w+;base64,/, '');

    // Detectar ambiente dinamicamente
    const isReactNative =
        typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

    if (!isReactNative) {
        // Ambiente de navegador
        const byteCharacters = atob(cleanedBase64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }

        return new Blob(byteArrays, { type: contentType });
    } else {
        // Ambiente React Native
        const RNFetchBlob = require('react-native-blob-util').default;
        const path = `${RNFetchBlob.fs.dirs.CacheDir}/${fileName}`;

        await RNFetchBlob.fs.writeFile(path, cleanedBase64, 'base64');

        return {
            uri: 'file://' + path,
            name: fileName,
            type: contentType,
        };
    }
}

export function downloadBase64Image(base64Data: string, filename = 'image.jpg') {
    const blob = base64ToBlob(base64Data);
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
// const saveBase64Image = async (base64Data: string, fileName: string = 'image.jpg'): Promise<string | null> => {
//     try {
//         // Caminho do arquivo a ser salvo
//         const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

//         // Remove prefixo data:image/jpeg;base64, se estiver presente
//         const base64WithoutPrefix = base64Data.replace(/^data:image\/\w+;base64,/, '');

//         // Salva o arquivo
//         await RNFS.writeFile(path, base64WithoutPrefix, 'base64');

//         console.log('Imagem salva em:', path);
//         return path; // você pode usar esse path para exibir a imagem depois
//     } catch (error) {
//         console.error('Erro ao salvar a imagem:', error);
//         return null;
//     }
// };

const extract = (info: any) => {
    // console.log(info);
    console.warn('Extract Info');
    const drilling = extractDrillingInfo(info);
    console.log(drilling);
    // const drillingIntervals = extractDrillingIntervalInfo(info);
    // console.log(drillingIntervals);
    // const intervalsLithologies = extractIntervalsLithologyInfo(info);
    // console.log(intervalsLithologies);

    const photos = extractPhotosInfo(info);
    console.log(photos);
    // saveBase64Image(photos[0], 'fotoPerfil.jpg');
    downloadBase64Image(photos[0], 'foto.jpg');
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

const extractPhotosInfo = (info: any) => {
    return info.photos;
}

type FormLoaderRouteProp = RouteProp<RootStackParamList, 'loader/form/index'>;
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
            <DynamicForm schemaId={formId} extract={extract} />
        </OperationModeProvider>
    );
};

export default FormLoader;