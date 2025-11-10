import { DataReader } from "@/core/types/data-reader";
import { CrudService } from "@/core/services/crud.service";
import { DrillingRecord } from "@/app-instance/types/drilling-record";
import { AdaptedDrillingRecord } from "@/app-instance/types/adapted-drilling-record";

export class EnergyFuelsDrillingReader implements DataReader {
  private language: string;

  constructor(language: string) {
    this.language = language;
  }

  async read(): Promise<AdaptedDrillingRecord[]> {
    const drillings = await CrudService.list<DrillingRecord>('drillings');
    const adaptedDrillings = drillings.map((item) => ({
      id: item.id,
      title: item.title,
      dates: this.formatDates(item.start_date, item.end_date, this.language)
    }));
    return adaptedDrillings;
  }

  columns(): string[] {
    return ["title", "dates"];
  }

  private formatDate(date: string, lang: string = "pt-BR"): string {
    const day = date.substring(0, 2);
    const mth = date.substring(3, 5);
    const year = date.substring(6, 10);
    if (lang === "pt-BR") {
      return day + "/" + mth + "/" + year;
    } else {
      return mth + "/" + day + "/" + year;
    }
  }

  private formatDates(start: string, end: string, language: string = "pt-BR"): string {
    if (start === end) return this.formatDate(start)
    return this.formatDate(start) + (language === "pt-BR" ? " a " : " to ") + this.formatDate(end)
  }
}