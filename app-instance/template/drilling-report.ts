import * as Sharing from 'expo-sharing';
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";

export class EnergyFuelsDrillingReport {

    public async generate(lang: string, drilling: any, segments: any, lithologies: any) {

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
            ${this.renderDrillingInfo(lang, drilling)}
            ${this.renderSegmentInfo(lang, segments, lithologies)}
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

    private formatDateEN(dateStr: string) {
        if (!dateStr) return '';

        const [day, month, year] = dateStr.split('/');

        const date = new Date(`${year}-${month}-${day}T00:00:00`);

        const formatter = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });

        return formatter.format(date).toString();
    }

    private renderDrillingInfo(language: string, drilling: any) {
        const isPT = language === 'pt-BR'
        const style = "background-color: #fff0d1;"

        const beginDate = isPT
            ? drilling.BEGIN_DATE
            : this.formatDateEN(drilling.BEGIN_DATE);

        const endDate = isPT
            ? drilling.END_DATE
            : this.formatDateEN(drilling.END_DATE);

        return `
            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}"><br/></div>

            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 33%;">
                    <b>${isPT ? 'Identificação da Perfuração' : 'Drilling ID'}:</b><br/>${drilling.ID_HOLE}
                </div>
                <div style="width: 34%;">
                    <b>${isPT ? 'Direito Minerário' : 'Mining Tenement'}:</b><br/>${drilling.MINING_TENEMENT}
                </div>
                <div style="width: 33%;">
                    <b>${isPT ? 'Superficiário' : 'Landowner'}:</b><br/>${drilling.LANDOWNER}
                </div>                             
            </div>

            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 100%;">
                    <b>${isPT ? 'Data(s)' : 'Date(s)'}:</b><br/>
                    ${beginDate}${beginDate !== endDate ? ' a ' + endDate : ''}
                </div>                
            </div>

            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 33%;">
                    <b>${isPT ? 'Coordenada Leste' : 'Easting'}:</b><br/>${drilling.EASTING}
                </div>

                <div style="width: 34%;">
                    <b>${isPT ? 'Coordenada Norte' : 'Northing'}:</b><br/>${drilling.NORTHING}
                </div>

                <div style="width: 33%;">
                    <b>${isPT ? 'Elevação' : 'Elevation'}:</b><br/>${drilling.ELEVATION}m
                </div>
            </div>
            
            ${drilling.JUSTIFICATION
                ? `
                <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                    <div style="width: 100%;">
                        <b>${isPT ? 'Justificativa de Interrupção' : 'Interruption Reason'}:</b><br/>${drilling.JUSTIFICATION}
                    </div>
                </div>
              `
                : ""
            } 
            
            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}"><br/></div>            
        `
    }

    private renderSegmentInfo(language: string, segments: any[], lithologies: any[]) {
        const isPT = language === 'pt-BR'
        let str = ""
        for (let i = 0; i < segments.length; i++) {
            const liths = lithologies.filter(item => item.SEGMENT_ID === segments[i].SEGMENT_ID);
            const style = i % 2 == 0 ? "background-color: #efefef;" : ""
            str += `
                <div style="display: flex; width: 100%; padding: 3px 0px;${style}">
                    <div style="width: 100%;">
                        <b style="text-decoration:underline">${isPT ? 'SEGMENTO' : 'COLLAR'} ${i + 1}</b> (${segments[i]._FROM}m ${isPT ? 'a' : 'to'} ${segments[i]._TO}m)<br/>
                    </div>            
                </div>

                <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                    <div style="width: 33%;">
                        <b>${isPT ? 'Recuperação' : 'Recovery'}:</b><br/>${segments[i].RECOVERY}%
                    </div>

                    <div style="width: 34%;">
                        <b>${isPT ? 'Umidade' : 'Moisture'}:</b><br/>${segments[i].MOISTURE}
                    </div>

                    <div style="width: 33%;">
                        <b>${isPT ? 'Dureza' : 'Hardness'}:</b><br/>${segments[i].HARDNESS}
                    </div>
                </div>

            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 33%;">
                    <b>${isPT ? 'Deslamagem' : 'Wash'}:</b><br/>${segments[i].WASH}
                </div>

                <div style="width: 34%;">
                    <b>${isPT ? 'Cor' : 'Color'}:</b><br/>${segments[i].COLOR}
                </div>

                <div style="width: 33%;">
                    <b>${isPT ? 'Cimentação' : 'Induration'}:</b><br/>${segments[i].INDURATION}
                </div>
            </div>
            
            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 33%;">
                    <b>${isPT ? 'Granulometria Mínima' : 'Minimum Granulometry'}:</b><br/>${segments[i].MINIMUM_GRANULOMETRY}
                </div>

                <div style="width: 34%;">
                    <b>${isPT ? 'Granulometria Máxima' : 'Maximum Granulometry'}:</b><br/>${segments[i].MAXIMUM_GRANULOMETRY}
                </div>

                <div style="width: 33%;">
                    <b>${isPT ? 'Esfericidade' : 'Roundness'}:</b><br/>${segments[i].ROUNDNESS}
                </div>
            </div>

            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 33%;">
                    <b>${isPT ? 'Argila/Silte' : 'Clay/Silt'}:</b><br/>${segments[i].CLAY}%
                </div>

                <div style="width: 34%;">
                    <b>${isPT ? 'Mica' : 'Micah'}:</b><br/>${segments[i].MICAH}%
                </div>

                <div style="width: 33%;">
                    <b>${isPT ? 'Conchas' : 'Shells'}:</b><br/>${segments[i].SHELLS}%
                </div>
            </div>

            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 33%;">
                    <b>${isPT ? 'Matéria Orgânica' : 'Organic Matter'}:</b><br/>${segments[i].ORGANIC_MATTER}%
                </div>

                <div style="width: 34%;">
                    <b>${isPT ? 'Fragmentos Líticos' : 'Lithic Fragments'}:</b><br/>${segments[i].LITHIC_FRAGMENTS}%
                </div>

                <div style="width: 33%;">
                    <b>${isPT ? 'HMS' : 'HMS'}:</b><br/>${segments[i].HMS}%
                </div>
            </div>            

            ` + this.renderLithologyInfo(language, liths, i)
        }
        return str
    }

    private renderLithologyInfo(language: string, lithology: any, index: number) {
        const isPT = language === 'pt-BR'
        const style = index % 2 == 0 ? "background-color: #efefef;" : ""
        let str = `
            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 11%;"></div>
                <div style="width: 89%;">
                    <b style="text-decoration:underline">${isPT ? 'LITOLOGIA' : 'LITHOLOGY'}</b>
                </div>
            </div>         
        `
        for (let i = 0; i < lithology.length; i++) {
            str += `
            <div style="display: flex; width: 100%;  padding: 3px 0px;${style}">
                <div style="width: 11%;"></div>
                <div style="width: 11%;"><b>${isPT ? 'De' : 'From'}:</b> ${lithology[i]._FROM}</div>
                <div style="width: 11%;"><b>${isPT ? 'Até' : 'To'}:</b> ${lithology[i]._TO}</div>
                <div style="width: 67%;">
                    <b>${isPT ? 'Tipo' : 'Type'}:</b> ${lithology[i].LITHOLOGY_TYPE}
                </div>
            </div>     
        `
        }
        str += `<div style="display: flex; width: 100%;  padding: 3px 0px;${style}"><br/></div>`
        return str
    }
}
