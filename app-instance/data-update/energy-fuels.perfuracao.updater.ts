// default-extractor.ts
import { DataUpdater } from "@/types/updater";
import { CrudService } from "@/services/crud.service";
import { ImageRecord } from '@/types/image-record';
import { enviarBancoPorEmail } from "@/services/email.service";
import { exportarBancoComSAF } from "@/services/file-copy.service";
import { Alert } from 'react-native';
import { LithologyRecord } from "@/types/lithology-record";

function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export class EnergyFuelsDrillingUpdater implements DataUpdater {
    // -----------------------------------------------------------    
    async update(info: any): Promise<void> {
        // console.warn('Update Info');
        // console.log(info);

        // informação básica da perfuração
        const drilling = this.extractDrillingInfo(info);
        // console.log(drilling);
        await this.updateDrilling(drilling);

        // const lastDrillingId = await CrudService.lastInsertId();
        // console.log(drilling!.id);

        // informação dos segmentos    
        const segments = this.extractSegmentsInfo(info);
        const segmentIds = info.ef_depth_test.segmentIds;
        // console.log(segments[0]);
        const segmentsWithId = segments.map((segment, index) => ({
            ...segment,
            id: segmentIds[index],
        }));
        // console.log(segmentsWithId[0]);        
        await this.updateSegments(drilling!.id, segmentsWithId);


        // imagens de cada segmento
        // for (let i = 0; i < segments.length; i++) {
        //     const photos = this.extractImagesInfo(i, info);
        //     await this.updateImages(segmentsIds[i], photos);
        // }

        // litologias de cada segmento        
        for (let i = 0; i < segments.length; i++) {
            const lithos = this.extractLithologiesInfo(segmentIds[i], info.ef_depth_test.lithologies[i]);
            await this.updateLithologies(segmentIds[i], lithos);
        }

        console.log(`Registro com ID ${drilling!.id} atualizado com sucesso.`);
        Alert.alert('Sucesso', `Registro com ID ${drilling!.id} foi atualizado.`);
    }

    // -----------------------------------------------------------
    private async updateDrilling(data: any) {
        await CrudService.update('drillings', {
            title: data.title,
            easting: data.easting,
            northing: data.northing,
            elevation: data.elevation,
            tenement: data.tenement,
            landowner: data.landowner,
            start_date: data.start_date,
            end_date: data.end_date,
            interruption_reason: data.interruption_reason
        },
            "id = ?",
            [data.id]
        );
    }

    // -----------------------------------------------------------
    private async updateSegments(drilling_id: number, data_array: any[]) {
        // console.warn(data_array[0]);
        let ids = [];
        for (const data of data_array) {
            await CrudService.update('segments',
                {
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
                },
                "id = ?",
                [data.id]
            );
            ids.push(data.id);
        }
        return ids;
    }

    private async updateImage(data: ImageRecord): Promise<void> {
        await CrudService.insert('images', {
            fgk_segment: data.fgk_segment,
            img: data.img,
        });
    }

    private async updateImages(index: number, photos: string[]) {
        for (const photo of photos) {
            await this.updateImage({
                fgk_segment: index,
                img: photo
            });
        }
    }

    private async updateLithology(data: LithologyRecord): Promise<void> {
        if (data.id) {
            await CrudService.update('lithologies',
                {
                    fgk_segment: data.fgk_segment,
                    depth_from: data.depth_from,
                    depth_to: data.depth_to,
                    fgk_lithology_type: data.fgk_lithology_type
                },
                "id = ?",
                [data.id]
            );
        } else {
            await CrudService.insert('lithologies',
                {
                    fgk_segment: data.fgk_segment,
                    depth_from: data.depth_from,
                    depth_to: data.depth_to,
                    fgk_lithology_type: data.fgk_lithology_type
                }
            );
        }
    }

    private async updateLithologies(index: number, lithologies: LithologyRecord[]) {
        for (const lithology of lithologies) {
            await this.updateLithology({
                id: lithology.id,
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
                id: info.id,
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
        const size = info.ef_depth_test ? info.ef_depth_test.depth.length : 0;
        let segments = [];
        for (let i = 0; i < size; i++) {
            segments.push({
                depthFrom: info.ef_depth_test.depth[i].from,
                depthTo: info.ef_depth_test.depth[i].to,
                recovery: info.ef_depth_test.recovery[i],
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
        return segments;
    }

    private extractLithologiesInfo(id: number, lithologies: any) {
        let lithos = [];
        lithologies.forEach((lithology, index) => {
            lithos.push({
                id: lithology.id,
                fgk_segment: id,
                depth_from: lithology.from,
                depth_to: lithology.to,
                fgk_lithology_type: lithology.type
            });
        });
        return lithos;
    }

    private extractImagesInfo(index: number, info: any) {
        return info.ef_depth_test.photos[index];
    }
}
