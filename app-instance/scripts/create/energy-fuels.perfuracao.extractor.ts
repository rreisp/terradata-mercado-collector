// default-extractor.ts
import { DataExtractor } from "@/core/types/data-extractor";
import { CrudService } from "@/core/services/crud.service";
import { ImageRecord } from '@/app-instance/types/image-record';
import { Alert } from 'react-native';
import { LithologyRecord } from "@/app-instance/types/lithology-record";

function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export class EnergyFuelsDrillingExtractor implements DataExtractor {
    // -----------------------------------------------------------    
    async extract(info: any): Promise<void> {
        // console.warn('Extract Info');
        // console.log(info);

        // informação básica da perfuração
        const drilling = this.extractDrillingInfo(info);

        // console.log(drilling);
        await this.saveDrilling(drilling);

        const lastDrillingId = await CrudService.lastInsertId();

        // informação dos segmentos    
        const segments = this.extractSegmentsInfo(info);

        // console.log(segments[0]);
        const segmentsIds = await this.saveSegments(lastDrillingId, segments);

        // imagens de cada segmento
        for (let i = 0; i < segments.length; i++) {
            console.log();
            const photos = this.extractPhotosInfo(i, info);
            await this.savePhotos(segmentsIds[i], photos);
        }

        // litologias de cada segmento        
        for (let i = 0; i < segments.length; i++) {
            const lithos = this.extractLithologiesInfo(segmentsIds[i], info.ef_depth_test.lithologies[i]);
            await this.saveLithologies(segmentsIds[i], lithos);
        }
        console.log(`Registro com ID ${lastDrillingId} inserido com sucesso.`);
        Alert.alert('Sucesso', `Registro com ID ${lastDrillingId} foi criado.`);
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
                fgk_hardness: data.hardness,
                fgk_wash: data.wash,
                fgk_color: data.color,
                fgk_induration: data.induration,
                fgk_min_grainsize: data.minGrainsize,
                fgk_max_grainsize: data.maxGrainsize,
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
            // console.warn(ex);
        }
    }

    private extractSegmentsInfo(info: any) {
        const size = info.ef_depth_test ? info.ef_depth_test.depth.length : 0;
        let intervals = [];
        for (let i = 0; i < size; i++) {
            intervals.push({
                depthFrom: info.ef_depth_test.depth[i].from,
                depthTo: info.ef_depth_test.depth[i].to,
                recovery: info.ef_depth_test.recovery[i],
                moisture: info.ef_depth_test.moisture[i],
                hardness: info.ef_depth_test.hardness[i],
                wash: info.ef_depth_test.wash[i],
                color: info.ef_depth_test.color[i],
                induration: info.ef_depth_test.induration[i],
                minGrainsize: info.ef_depth_test.minGrainsize[i],
                maxGrainsize: info.ef_depth_test.maxGrainsize[i],
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

    private extractLithologiesInfo(id: number, lithologies: any) {
        let records = [];
        lithologies.forEach((lithology, index) => {
            records.push({
                fgk_segment: id,
                depth_from: lithology.from,
                depth_to: lithology.to,
                fgk_lithology_type: lithology.type
            });
        });
        return records;
    }

    private extractPhotosInfo(index: number, info: any) {
        return info.ef_depth_test.photos[index].map(item => item.img);
    }
}
