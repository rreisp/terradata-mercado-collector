// default-extractor.ts
import { Extractor } from "@/types/extractor";
import { CrudService } from "@/services/crud-service";
import { ImageRecord } from '@/types/image-record';
import { enviarBancoPorEmail } from "@/services/email-service";

export class EnergyFuelsDrillingExtractor implements Extractor {
    async extract(info: any): Promise<void> {
        console.warn('Extract Info');

        const drilling = this.extractDrillingInfo(info);
        // console.log(drilling);

        // enviarBancoPorEmail();

        // Exemplo de extração adicional:
        const drillingIntervals = this.extractDrillingIntervalInfo(info);
        // const lithologies = this.extractIntervalsLithologyInfo(info);
        // const photos = this.extractPhotosInfo(info);
        // await this.save(photos);
    }

    private async createImage(data: ImageRecord): Promise<void> {
        await CrudService.insert('images', {
            fgk_interval: data.fgk_interval,
            img: data.img,
        });
    }

    private async save(photos: string[]) {
        for (const photo of photos) {
            await this.createImage({
                fgk_interval: 1,
                img: photo
            });
        }
    }

    private extractDrillingInfo(info: any) {
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
        };
    }

    private extractDrillingIntervalInfo(info: any) {
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
                photos: info.ef_depth_test.photos[i]
            });
        }
        return intervals;
    }

    private extractIntervalsLithologyInfo(info: any) {
        console.log(info.ef_depth_test.lithologies);
    }

    private extractPhotosInfo(info: any) {
        return info.photos;
    }
}
