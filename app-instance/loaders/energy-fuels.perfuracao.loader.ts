import { CrudService } from "@/services/crud.service";
import { DrillingRecord } from "@/types/drilling-record";
import { LithologyRecord } from "@/types/lithology-record";
import { Loader } from "@/types/loader";
import { SegmentRecord } from "@/types/segment-record";

function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
}

export class EnergyFuelsDrillingLoader implements Loader {
    async load(schemaId: string, itemId: number): Promise<{ [key: string]: any }> {
        const drilling = await this.loadDrilling(itemId);
        const segments = await this.loadSegments(itemId);
        // console.error(segments[0]);

        let segmentIds: (number | undefined)[] = [];
        let depth: { from: number, to: number }[] = [];

        let clayPct: number[] = [];
        let color: number[] = [];
        let comments: string[] = [];
        let grainsize: number[] = [];
        let hardness: number[] = [];
        let hms: number[] = [];
        let induration: number[] = [];
        let lithicFragmentsPct: number[] = [];
        // lithologies: Array<LithologyRecord>
        let micahPct: number[] = [];
        let moisture: number[] = [];
        let organicMatterPct: number[] = [];
        // let photos: number[] = [];
        let roundness: number[] = [];
        let recovery: number[] = [];
        let shellsPct: number[] = [];
        let sorting: number[] = [];
        let volume: number[] = [];
        let wash: number[] = [];

        segments.forEach(segment => {
            // console.log(segment);
            segmentIds.push(segment.id);
            depth.push({ from: segment.depth_from, to: segment.depth_to });

            clayPct.push(segment.clay);
            color.push(segment.fgk_color);
            comments.push(segment.comments);
            grainsize.push(segment.fgk_grainsize);
            hardness.push(segment.fgk_hardness);
            hms.push(segment.hms);
            induration.push(segment.fgk_induration);
            lithicFragmentsPct.push(segment.lithic_fragments);
            micahPct.push(segment.micah);
            moisture.push(segment.fgk_moisture);
            organicMatterPct.push(segment.organic_matter);
            roundness.push(segment.fgk_roundness);
            recovery.push(segment.recovery);
            shellsPct.push(segment.shells);
            sorting.push(segment.fgk_sorting);
            volume.push(segment.volume);
            wash.push(segment.fgk_wash);
        });

        return {
            "title": drilling.title,
            "ef_coordinates": {
                "easting": drilling.easting,
                "northing": drilling.northing,
                "elevation": drilling.elevation
            },
            "tenement": drilling.tenement,
            "landowner": drilling.landowner,
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
                grainsize,
                hardness,
                hms,
                induration,
                lithicFragmentsPct,
                micahPct,
                moisture,
                organicMatterPct,
                roundness,
                recovery,
                shellsPct,
                sorting,
                volume,
                wash
            }
        };
    }

    // -----------------------------------------------------------
    private async loadDrilling(itemId: number) {
        const drilling = (await CrudService.list<DrillingRecord>(
            "drillings",
            ["id="],
            [itemId]
        ))[0];
        return drilling;
    }

    private async loadSegments(drillingId: number) {
        const segments = (await CrudService.list<SegmentRecord>(
            "segments",
            ["fgk_drilling="],
            [drillingId]
        ));
        return segments;
    }
}