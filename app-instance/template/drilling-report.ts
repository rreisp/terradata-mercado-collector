import * as Sharing from 'expo-sharing';
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";

export class MercadoInconfidentesCombustiveisReport {
    private isPT = true;

    constructor(lang: string) {
        this.isPT = lang === 'pt-BR'
    }

    public async generate(drilling: any, segments: any, lithologies: any) {
        // 🔹 Função auxiliar para formatar a data como YYYYMMDDHHmm
        const formatTimestamp = () => {
            const now = new Date();

            const YYYY = now.getFullYear();
            const MM = String(now.getMonth() + 1).padStart(2, "0");
            const DD = String(now.getDate()).padStart(2, "0");
            const HH = String(now.getHours()).padStart(2, "0");
            const mm = String(now.getMinutes()).padStart(2, "0");

            return `${YYYY}${MM}${DD}_${HH}h${mm}`;
        };

        const html = `
        <html>
        <header>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </header>
        <body>            
            ${this.renderCombustiveisInfo(drilling)}
            ${this.renderSegmentInfo(segments, lithologies)}
        </body>
        </html>
    `;

        // 1. Gera PDF temporário
        const { uri } = await Print.printToFileAsync({
            html,
            base64: false,
        });

        // 2. Nome final com timestamp elegante
        const timestamp = formatTimestamp();
        const fileName = `${drilling.ID_HOLE}_${timestamp}.pdf`;
        const finalPath = FileSystem.documentDirectory + fileName;

        // 3. Renomeia / move
        await FileSystem.moveAsync({
            from: uri,
            to: finalPath,
        });

        // 4. Compartilha
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(finalPath);
        }

        return finalPath;
    }

    private renderCombustiveisInfo(drilling: any) {
        const style = "background-color: #fff0d1;"

        return `
            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}"><br/></div>

            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 33%;">
                    <b>${this.isPT ? 'Identificação da Perfuração' : 'Combustiveis ID'}:</b><br/>${drilling.ID_HOLE}
                </div>
                <div style="width: 34%;">
                    <b>${this.isPT ? 'Direito Minerário' : 'Mining Tenement'}:</b><br/>${drilling.MINING_TENEMENT}
                </div>
                <div style="width: 33%;">
                    <b>${this.isPT ? 'Superficiário' : 'Landowner'}:</b><br/>${drilling.LANDOWNER}
                </div>                             
            </div>

            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 100%;">
                    <b>${this.isPT ? 'Data(s)' : 'Date(s)'}:</b><br/>
                    ${drilling.BEGIN_DATE.replaceAll("-", "/")}${drilling.BEGIN_DATE !== drilling.END_DATE ? (this.isPT ? ' a ' : ' to ') + drilling.END_DATE.replaceAll("-", "/") : ''}
                </div>                
            </div>

            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 33%;">
                    <b>${this.isPT ? 'Coordenada Leste' : 'Easting'}:</b><br/>${drilling.EASTING}
                </div>

                <div style="width: 34%;">
                    <b>${this.isPT ? 'Coordenada Norte' : 'Northing'}:</b><br/>${drilling.NORTHING}
                </div>

                <div style="width: 33%;">
                    <b>${this.isPT ? 'Elevação' : 'Elevation'}:</b><br/>${drilling.ELEVATION}m
                </div>
            </div>
            
            ${drilling.JUSTIFICATION
                ? `
                <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                    <div style="width: 100%;">
                        <b>${this.isPT ? 'Justificativa de Interrupção' : 'Interruption Reason'}:</b><br/>${drilling.JUSTIFICATION}
                    </div>
                </div>
              `
                : ""
            } 
            
            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}"><br/></div>            
        `
    }

    private renderSegmentInfo(segments: any[], lithologies: any[]) {
        let str = ""
        for (let i = 0; i < segments.length; i++) {
            const liths = lithologies.filter(item => item.SEGMENT_ID === segments[i].SEGMENT_ID);
            const style = i % 2 == 0 ? "background-color: #efefef;" : ""
            str += `
                <div style="display: flex; width: 100%; padding: 3px 0px;${style}">
                    <div style="width: 100%;">
                        <b style="text-decoration:underline">${this.isPT ? 'SEGMENTO' : 'COLLAR'} ${i + 1}</b> (${segments[i]._FROM}m ${this.isPT ? 'a' : 'to'} ${segments[i]._TO}m)<br/>
                    </div>            
                </div>

                <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                    <div style="width: 33%;">
                        <b>${this.isPT ? 'Recuperação' : 'Recovery'}:</b><br/>${segments[i].RECOVERY}%
                    </div>

                    <div style="width: 34%;">
                        <b>${this.isPT ? 'Umidade' : 'Moisture'}:</b><br/>${segments[i].MOISTURE}
                    </div>

                    <div style="width: 33%;">
                        <b>${this.isPT ? 'Dureza' : 'Hardness'}:</b><br/>${segments[i].HARDNESS}
                    </div>
                </div>

            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 33%;">
                    <b>${this.isPT ? 'Deslamagem' : 'Wash'}:</b><br/>${segments[i].WASH}
                </div>

                <div style="width: 34%;">
                    <b>${this.isPT ? 'Cor' : 'Color'}:</b><br/>${segments[i].COLOR}
                </div>

                <div style="width: 33%;">
                    <b>${this.isPT ? 'Cimentação' : 'Induration'}:</b><br/>${segments[i].INDURATION}
                </div>
            </div>
            
            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 33%;">
                    <b>${this.isPT ? 'Granulometria Mínima' : 'Minimum Granulometry'}:</b><br/>${segments[i].MINIMUM_GRANULOMETRY}
                </div>

                <div style="width: 34%;">
                    <b>${this.isPT ? 'Granulometria Máxima' : 'Maximum Granulometry'}:</b><br/>${segments[i].MAXIMUM_GRANULOMETRY}
                </div>

                <div style="width: 33%;">
                    <b>${this.isPT ? 'Esfericidade' : 'Roundness'}:</b><br/>${segments[i].ROUNDNESS}
                </div>
            </div>

            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 33%;">
                    <b>${this.isPT ? 'Argila/Silte' : 'Clay/Silt'}:</b><br/>${segments[i].CLAY}%
                </div>

                <div style="width: 34%;">
                    <b>${this.isPT ? 'Mica' : 'Micah'}:</b><br/>${segments[i].MICAH}%
                </div>

                <div style="width: 33%;">
                    <b>${this.isPT ? 'Conchas' : 'Shells'}:</b><br/>${segments[i].SHELLS}%
                </div>
            </div>

            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 33%;">
                    <b>${this.isPT ? 'Matéria Orgânica' : 'Organic Matter'}:</b><br/>${segments[i].ORGANIC_MATTER}%
                </div>

                <div style="width: 34%;">
                    <b>${this.isPT ? 'Fragmentos Líticos' : 'Lithic Fragments'}:</b><br/>${segments[i].LITHIC_FRAGMENTS}%
                </div>

                <div style="width: 33%;">
                    <b>${this.isPT ? 'HMS' : 'HMS'}:</b><br/>${segments[i].HMS}%
                </div>
            </div>            

            ` + this.renderLithologyInfo(liths, i)
        }
        return str
    }

    private renderLithologyInfo(lithologies: any, index: number) {
        console.log(lithologies)
        const lithology = lithologies
        const style = index % 2 == 0 ? "background-color: #efefef;" : ""
        let str = `
            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 11%;"></div>
                <div style="width: 89%;">
                    <b style="text-decoration:underline">${this.isPT ? 'LITOLOGIA' : 'LITHOLOGY'}</b>
                </div>
            </div>         
        `
        for (let i = 0; i < lithology.length; i++) {
            str += `
            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 11%;"></div>
                <div style="width: 11%;"><b>${this.isPT ? 'De' : 'From'}:</b> ${lithology[i]._FROM}</div>
                <div style="width: 11%;"><b>${this.isPT ? 'Até' : 'To'}:</b> ${lithology[i]._TO}</div>
                <div style="width: 67%;">
                    <b>${this.isPT ? 'Tipo' : 'Type'}:</b> ${lithology[i].LITHOLOGY_TYPE}
                </div>
            </div>     
        `
        }
        str += `<div style="display: flex; width: 100%;  padding: 3px 0px;${style}"><br/></div>`
        return str
    }
}
