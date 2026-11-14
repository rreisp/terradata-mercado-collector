import { DataReader } from "@/core/types/data-reader";
import { CrudService } from "@/core/services/crud.service";
import { CombustiveisRecord } from "@/app-instance/types/combustiveis-record";
import { AdaptedCombustiveisRecord } from "@/app-instance/types/adapted-combustiveis-record";

export class MercadoInconfidentesCombustiveisReader implements DataReader {
  private language: string;

  constructor(language: string) {
    this.language = language;
  }

  async read(): Promise<AdaptedCombustiveisRecord[]> {
    try {
      const registros = await CrudService.list<CombustiveisRecord>('mercado_combustiveis', {
        columns: ["id", "estabelecimento", "data"]
      });
      const adaptedCombustiveis = registros.map((item) => ({
        id: item.id,
        estabelecimento: item.estabelecimento,
        data: this.formatDate(item.data)
      }));
      return adaptedCombustiveis;
    } catch (e) {
      console.error("MercadoInconfidentesCombustiveisReader.read")
      console.log(e)
      return []
    }
  }

  columns(): string[] {
    try {
      return ["estabelecimento", "data"];
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
}