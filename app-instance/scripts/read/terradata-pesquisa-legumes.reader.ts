import { DataReader } from "@/core/types/data-reader";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaLegumesReader implements DataReader {
  private language: string;

  constructor(language: string) {
    this.language = language;
  }

  async read(): Promise<any[]> {
    try {
      const registros = await CrudService.list<any>('mercado_legumes', {
        columns: ["id", "estabelecimento", "data"]
      });
      const adaptedLegumes = registros.map((item) => ({
        id: item.id,
        estabelecimento: item.estabelecimento,
        data: this.formatDate(item.data)
      }));
      return adaptedLegumes;
    } catch (e) {
      console.error("TerradataPesquisaLegumesReader.read")
      console.log(e)
      return []
    }
  }

  columns(): string[] {
    try {
      return ["estabelecimento", "data"];
    } catch (e) {
      console.error("TerradataPesquisaLegumesReader.columns")
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
      console.error("TerradataPesquisaLegumesReader.formatDate")
      console.log(e)
      return ''
    }
  }
}
