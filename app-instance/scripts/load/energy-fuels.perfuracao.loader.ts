import { CrudService } from "@/core/services/crud.service";
import { DrillingRecord } from "@/app-instance/types/drilling-record";
import { ImageRecord } from "@/app-instance/types/image-record";
import { LithologyRecord } from "@/app-instance/types/lithology-record";
import { DataLoader } from "@/core/types/data-loader";
import { SegmentRecord } from "@/app-instance/types/segment-record";

function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
}

export class EnergyFuelsDrillingLoader implements DataLoader {
    async load(rootItemId: number): Promise<{ [key: string]: any }> {
        try {
            const drilling = await this.loadDrilling(rootItemId);
            const segments = await this.loadSegments(rootItemId);

            let segmentIds: (number | undefined)[] = [];
            let depth: { from: number, to: number }[] = [];

            let clayPct: number[] = [];
            let color: number[] = [];
            let comments: string[] = [];
            let minGrainsize: number[] = [];
            let maxGrainsize: number[] = [];
            let hardness: number[] = [];
            let hms: number[] = [];
            let induration: number[] = [];
            let lithicFragmentsPct: number[] = [];
            let micahPct: number[] = [];
            let moisture: number[] = [];
            let organicMatterPct: number[] = [];
            let roundness: number[] = [];
            let sorting: number[] = [];            
            let recovery: number[] = [];
            let shellsPct: number[] = [];
            let wash: number[] = [];

            let photos: ImageRecord[][] = [];
            let lithologies: LithologyRecord[][] = [];

            // await Promise.all(segments.map(async (segment) => {
            for (const segment of segments) {
                segmentIds.push(segment.id);
                depth.push({ from: segment.depth_from, to: segment.depth_to });

                clayPct.push(segment.clay);
                color.push(segment.fgk_color);
                comments.push(segment.comments);
                hardness.push(segment.fgk_hardness);
                hms.push(segment.hms);
                induration.push(segment.fgk_induration);
                lithicFragmentsPct.push(segment.lithic_fragments);
                micahPct.push(segment.micah);
                moisture.push(segment.fgk_moisture);
                organicMatterPct.push(segment.organic_matter);
                sorting.push(segment.fgk_sorting);
                roundness.push(segment.fgk_roundness);
                recovery.push(segment.recovery);
                shellsPct.push(segment.shells);
                minGrainsize.push(segment.fgk_min_grainsize);
                maxGrainsize.push(segment.fgk_max_grainsize);
                wash.push(segment.fgk_wash);

                let segmentImages = await this.loadImages(segment.id!);
                photos.push(segmentImages);

                let segmentLithologies = await this.loadLithologies(segment.id!);
                // console.error(segmentLithologies);
                const adaptLithologies = (arr: any[]) =>
                    segmentLithologies.map(item => ({
                        from: item.depth_from,
                        to: item.depth_to,
                        type: item.fgk_lithology_type,
                        id: item.id,
                    }));
                lithologies.push(adaptLithologies(segmentLithologies));
                // lithologies.push(...lithologiesArray);
            }


            return {
                "id": drilling.id,
                "title": drilling.title,
                "ef_coordinates": {
                    "easting": drilling.easting,
                    "northing": drilling.northing,
                    "elevation": drilling.elevation
                },
                "tenement": drilling.tenement,
                "landowner": drilling.landowner,
                "responsible": drilling.responsible,
                "ef_dates": {
                    "start": parseDate(drilling.start_date),
                    "end": parseDate(drilling.end_date)
                },
                "reason": drilling.interruption_reason,
                "ef_depth_test": {
                    segmentIds,
                    depth,
                    clayPct,
                    color,
                    comments,
                    hardness,
                    hms,
                    induration,
                    lithicFragmentsPct,
                    micahPct,
                    moisture,
                    organicMatterPct,
                    sorting,
                    roundness,
                    recovery,
                    shellsPct,
                    minGrainsize,
                    maxGrainsize,
                    wash,
                    lithologies,
                    photos
                }
            };
        } catch (e) {
            console.error("EnergyFuelsDrillingLoader.load")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async loadDrilling(itemId: number) {
        try {
            const drilling = (await CrudService.list<DrillingRecord>(
                "drillings",
                {
                    where: ["id = ?"],
                    params: [itemId]
                }
            ))[0];
            return drilling;
        } catch (e) {
            console.error("EnergyFuelsDrillingLoader.loadDrilling")
            console.log(e)
        }
    }

    private async loadSegments(drillingId: number) {
        try {
            const segments = await CrudService.list<SegmentRecord>(
                "segments",
                {
                    where: ["fgk_drilling = ?"],
                    params: [drillingId]
                }
            );
            return segments;
        } catch (e) {
            console.error("EnergyFuelsDrillingLoader.loadSegments")
            console.log(e)
        }
    }

    private async loadLithologies(segmentId: number) {
        try {
            const lithologies = await CrudService.list<LithologyRecord>(
                "lithologies",
                {
                    where: ["fgk_segment = ?"],
                    params: [segmentId],
                    orderBy: "depth_to ASC"
                }
            );
            return lithologies;
        } catch (e) {
            console.error("EnergyFuelsDrillingLoader.loadSegments")
            console.log(e)
        }
    }

    private async loadImages(segmentId: number) {
        try {
            const images = await CrudService.list<ImageRecord>(
                "images",
                {
                    where: ["fgk_segment = ?"],
                    params: [segmentId]
                }
            );
            return images;
        } catch (e) {
            console.error("EnergyFuelsDrillingLoader.loadSegments")
            console.log(e)
        }
    }
}
