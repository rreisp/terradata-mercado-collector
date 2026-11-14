import { DataReader } from "@/core/types/data-reader";
import { CrudService } from "@/core/services/crud.service";
import { CarnesRecord } from "@/app-instance/types/carnes-record";
import { AdaptedCarnesRecord } from "@/app-instance/types/adapted-carnes-record";

export class MercadoInconfidentesCarnesReader implements DataReader {
  private language: string;

  constructor(language: string) {
    this.language = language;
  }

  async read(): Promise<AdaptedCarnesRecord[]> {
    try {
      const registros = await CrudService.list<CarnesRecord>('mercado_carnes', {
        columns: ["id", "estabelecimento", "data"]
      });
      console.warn(registros)
      const adaptedCarnes = registros.map((item) => ({
        id: item.id,
        estabelecimento: item.estabelecimento,
        data: this.formatDate(item.data)
      }));
      return adaptedCarnes;
    } catch (e) {
      console.error("MercadoInconfidentesCarnesReader.read");
      console.log(e);
      return [];
    }
  }

  columns(): string[] {
    try {
      return ["estabelecimento", "data"];
    } catch (e) {
      console.error("MercadoInconfidentesCarnesReader.columns");
      console.log(e);
      return [];
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
      console.error("MercadoInconfidentesCarnesReader.formatDate");
      console.log(e);
      return '';
    }
  }
}