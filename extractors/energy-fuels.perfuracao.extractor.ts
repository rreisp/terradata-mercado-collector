// default-extractor.ts
import { Extractor } from "@/types/extractor";
import { CrudService } from "@/services/crud.service";
import { ImageRecord } from '@/types/image-record';
import { enviarBancoPorEmail } from "@/services/email.service";
import { exportarBancoComSAF } from "@/services/file-copy.service";
import { Alert } from 'react-native';
import { useNavigation } from "expo-router";
import { LithologyRecord } from "@/types/lithology-record";

function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}


export class EnergyFuelsDrillingExtractor implements Extractor {
    private navigation = useNavigation();
    // -----------------------------------------------------------    
    async extract(info: any): Promise<void> {
        // console.warn('Extract Info');

        // informação básica da perfuração        
        const drilling = this.extractDrillingInfo(info);
        // console.log(drilling);
        await this.saveDrilling(drilling);

        const lastDrillingId = await CrudService.lastInsertId();

        // informação dos segmentos    
        const segments = this.extractSegmentsInfo(info);
        // console.log(segments);
        const segmentsIds = await this.saveSegments(lastDrillingId, segments);

        // imagens de cada segmento
        for (let i = 0; i < segments.length; i++) {
            const photos = this.extractPhotosInfo(i, info);
            await this.savePhotos(segmentsIds[i], photos);
        }

        // litologias de cada segmento        
        for (let i = 0; i < segments.length; i++) {
            const lithos = this.extractLithologiesInfo(i, info);
            await this.saveLithologies(segmentsIds[i], lithos);
        }

        // console.log(`Registro com ID ${lastDrillingId} inserido com sucesso.`);
        Alert.alert('Sucesso', `Registro com ID ${lastDrillingId} foi criado.`);

        this.navigation.navigate('loader/list/index', { schemaId: 'energy-fuels.perfuracao' });

        // informação dos intervalos
        // const drillingIntervals = this.extractDrillingIntervalInfo(info);
        // console.log(drillingIntervals);

        //informação da litologia de cada intervalo
        // const lithologies = this.extractIntervalsLithologyInfo(info);




    }

    // -----------------------------------------------------------
    private async saveDrilling(data: any) {
        await CrudService.insert('drillings', {
            title: data.title,
            easting: data.easting,
            northing: data.northing,
            elevation: data.elevation,
            tenement: data.tenement,
            landowner: data.landowner,
            start_date: data.start_date,
            end_date: data.end_date,
            interruption_reason: data.interruption_reason
        });
    }

    // -----------------------------------------------------------
    private async saveSegments(drilling_id: number, data_array: any[]) {
        // console.warn(data_array[0]);
        let lastInsertIds = [];
        for (const data of data_array) {
            await CrudService.insert('segments', {
                fgk_drilling: drilling_id,
                depth_from: data.depthFrom,
                depth_to: data.depthTo,
                recovery: data.recovery,
                fgk_moisture: data.moisture,
                volume: data.volume,
                fgk_hardness: data.hardness,
                fgk_wash: data.wash,
                fgk_color: data.color,
                fgk_induration: data.induration,
                fgk_grainsize: data.grainsize,
                fgk_sorting: data.sorting,
                fgk_roundness: data.roundness,
                clay: data.clay,
                micah: data.micah,
                shells: data.shells,
                organic_matter: data.organicMatter,
                lithic_fragments: data.lithicFragments,
                hms: data.hms,
                comments: data.comments
            });
            const lastId: number = await CrudService.lastInsertId();
            lastInsertIds.push(lastId);
        }
        return lastInsertIds;
    }


    private async createImage(data: ImageRecord): Promise<void> {
        await CrudService.insert('images', {
            fgk_segment: data.fgk_segment,
            img: data.img,
        });
    }

    private async createLithology(data: LithologyRecord): Promise<void> {
        await CrudService.insert('lithologies', {
            fgk_segment: data.fgk_segment,
            depth_from: data.depth_from,
            depth_to: data.depth_to,
            fgk_lithology_type: data.fgk_lithology_type
        });
    }

    private async savePhotos(index: number, photos: string[]) {
        for (const photo of photos) {
            await this.createImage({
                fgk_segment: index,
                img: photo
            });
        }
    }

    private async saveLithologies(index: number, lithologies: LithologyRecord[]) {
        for (const lithology of lithologies) {
            await this.createLithology({
                fgk_segment: index,
                depth_from: lithology.depth_from,
                depth_to: lithology.depth_to,
                fgk_lithology_type: lithology.fgk_lithology_type
            });
        }
    }

    private extractDrillingInfo(info: any) {
        try {
            return {
                title: info.title,
                easting: info.ef_coordinates.easting,
                northing: info.ef_coordinates.northing,
                elevation: info.ef_coordinates.elevation,
                tenement: info.tenement,
                landowner: info.landowner,
                start_date: formatDate(info.ef_dates.start),
                end_date: formatDate(info.ef_dates.end),
                interruption_reason: info.reason
            }
        } catch (ex) {
            console.warn(ex);
        }
    }

    private extractSegmentsInfo(info: any) {
        const size = info.ef_depth_test.depth?.length || 0;
        let intervals = [];
        for (let i = 0; i < size; i++) {
            intervals.push({
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
                comments: info.ef_depth_test.comments[i],
            });
        }
        return intervals;
    }

    private extractLithologiesInfo(info: any) {
        return info.ef_depth_test.lithologies;
    }

    private extractPhotosInfo(index: number, info: any) {
        return info.ef_depth_test.photos[index];
    }
}
