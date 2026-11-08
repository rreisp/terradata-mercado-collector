import { DataReader } from "@/core/types/data-reader";
import { CrudService } from "@/core/services/crud.service";
import { CombustiveisRecord } from "@/app-instance/types/drilling-record";
import { AdaptedCombustiveisRecord } from "@/app-instance/types/adapted-drilling-record";

export class MercadoInconfidentesCombustiveisReader implements DataReader {
  private language: string;

  constructor(language: string) {
    this.language = language;
  }

  async read(): Promise<AdaptedCombustiveisRecord[]> {
    try {
      const drillings = await CrudService.list<CombustiveisRecord>('drillings', {
        columns: ["id", "title", "start_date", "end_date"]
      });
      const adaptedCombustiveiss = drillings.map((item) => ({
        id: item.id,
        title: item.title,
        dates: this.formatDates(item.start_date, item.end_date)
      }));
      return adaptedCombustiveiss;
    } catch (e) {
      console.error("MercadoInconfidentesCombustiveisReader.read")
      console.log(e)
      return []
    }
  }

  columns(): string[] {
    try {
      return ["title", "dates"];
    } catch (e) {
      console.error("MercadoInconfidentesCombustiveisReader.columns")
      console.log(e)
      return []
    }
  }

  private formatDate(date: string, lang: string = "pt-BR"): string {
    try {
      const day = date.substring(0, 2);
      const mth = date.substring(3, 5);
      const year = date.substring(6, 10);
      if (lang === "pt-BR") {
        return day + "/" + mth + "/" + year;
      } else {
        return mth + "/" + day + "/" + year;
      }
    } catch (e) {
      console.error("MercadoInconfidentesCombustiveisReader.formatDate")
      console.log(e)
      return ''
    }
  }

  private formatDates(start: string, end: string): string {
    try {
      if (start === end) return this.formatDate(start, this.language)
      return this.formatDate(start, this.language) + (this.language === "pt-BR" ? " a " : " to ") + this.formatDate(end, this.language)
    } catch (e) {
      console.error("MercadoInconfidentesCombustiveisReader.formatDate")
      console.log(e)
      return ''
    }
  }
}