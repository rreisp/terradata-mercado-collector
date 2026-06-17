// default-extractor.ts
import { DataUpdater } from "@/core/types/data-updater";
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

export class EnergyFuelsDrillingUpdater implements DataUpdater {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async update(info: any): Promise<void> {
        try {
            // informação básica da perfuração
            const drilling = this.extractDrillingInfo(info);
            // console.log(drilling);
            await this.updateDrilling(drilling);

            // informação dos segmentos    
            const segments = this.extractSegmentsInfo(info);
            let segmentIds = info.ef_depth_test.segmentIds;
            // console.log(segments[0]);
            const segmentsWithId = segments.map((segment, index) => ({
                ...segment,
                id: segmentIds[index],
            }));
            segmentIds = await this.updateSegments(drilling!.id, segmentsWithId);

            // imagens de cada segmento
            for (let i = 0; i < segments.length; i++) {
                const photos = this.extractImagesInfo(i, info);
                await this.updateImages(segmentIds[i], photos);
            }

            // litologias de cada segmento        
            for (let i = 0; i < segments.length; i++) {
                const lithos = this.extractLithologiesInfo(segmentIds[i], info.ef_depth_test.lithologies[i]);
                await this.updateLithologies(segmentIds[i], lithos);
            }

            console.log(`Registro com ID ${drilling!.id} atualizado com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro atualizado.` : `Record updated.`
            );
        } catch (e) {
            console.error("EnergyFuelsDrillingUpdater.update")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async updateDrilling(data: any) {
        try {
            await CrudService.update('drillings', {
                title: data.title,
                easting: data.easting,
                northing: data.northing,
                elevation: data.elevation,
                tenement: data.tenement,
                landowner: data.landowner,
                start_date: data.start_date,
                end_date: data.end_date,
                responsible: data.responsible,
                interruption_reason: data.interruption_reason
            },
                "id = ?",
                [data.id]
            );
        } catch (e) {
            console.error("EnergyFuelsDrillingUpdater.updateDrilling")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async updateSegments(drilling_id: number, data_array: any[]) {
        try {
            let ids = [];
            for (let data of data_array) {
                if (data.id) {
                    await CrudService.update('segments',
                        {
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
                } else {
                    await CrudService.insert('segments',
                        {
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
                            fgk_sorting: data.sorting,
                            fgk_roundness: data.roundness,
                            clay: data.clay,
                            micah: data.micah,
                            shells: data.shells,
                            organic_matter: data.organicMatter,
                            lithic_fragments: data.lithicFragments,
                            hms: data.hms,
                            comments: data.comments
                        }
                    );
                    const lastSegmentId = await CrudService.lastInsertId();
                    ids.push(lastSegmentId);
                }
            }
            return ids;
        } catch (e) {
            console.error("EnergyFuelsDrillingUpdater.updateSegments")
            console.log(e)
        }
    }

    private async updateImage(data: ImageRecord): Promise<void> {
        try {
            await CrudService.update(
                'images',
                {
                    fgk_segment: data.fgk_segment,
                    img: data.img,
                },
                "id = ?",
                [data.id]
            );
        } catch (e) {
            console.error("EnergyFuelsDrillingUpdater.updateImage")
            console.log(e)
        }
    }

    private async updateImages(segmentId: number, photos: ImageRecord[]) {
        try {
            for (const photo of photos) {
                if (photo.id) {
                    await this.updateImage({
                        id: photo.id,
                        fgk_segment: segmentId,
                        img: photo.img
                    });
                } else {
                    await CrudService.insert('images',
                        {
                            fgk_segment: segmentId,
                            img: photo.img,
                        }
                    );
                }
            }
        } catch (e) {
            console.error("EnergyFuelsDrillingUpdater.updateImages")
            console.log(e)
        }
    }

    private async updateLithology(data: LithologyRecord): Promise<void> {
        try {
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
        } catch (e) {
            console.error("EnergyFuelsDrillingUpdater.updateLithology")
            console.log(e)
        }
    }

    private async updateLithologies(index: number, lithologies: LithologyRecord[]) {
        try {
            for (const lithology of lithologies) {
                await this.updateLithology({
                    id: lithology.id,
                    fgk_segment: index,
                    depth_from: lithology.depth_from,
                    depth_to: lithology.depth_to,
                    fgk_lithology_type: lithology.fgk_lithology_type
                });
            }
        } catch (e) {
            console.error("EnergyFuelsDrillingUpdater.updateLithologies")
            console.log(e)
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
                responsible: info.responsible,
                interruption_reason: info.reason
            }
        } catch (e) {
            console.error("EnergyFuelsDrillingUpdater.extractDrillingInfo")
            console.log(e)
        }
    }

    private extractSegmentsInfo(info: any) {
        try {
            const size = info.ef_depth_test ? info.ef_depth_test.depth.length : 0;
            let segments = [];
            for (let i = 0; i < size; i++) {
                segments.push({
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
        } catch (e) {
            console.error("EnergyFuelsDrillingUpdater.extractSegmentsInfo")
            console.log(e)
        }
    }

    private extractLithologiesInfo(id: number, lithologies: any) {
        try {
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
        } catch (e) {
            console.error("EnergyFuelsDrillingUpdater.extractLithologiesInfo")
            console.log(e)
        }
    }

    private extractImagesInfo(index: number, info: any) {
        try {
            return info.ef_depth_test.photos[index];
        } catch (e) {
            console.error("EnergyFuelsDrillingUpdater.extractImagesInfo")
            console.log(e)
        }
    }
}
