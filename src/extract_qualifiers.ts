// there are three ways to do this, return data, or stream to files, or return the stream
// staying with the files generation

import fs from "fs"
import xmlReadStream from "xml-flow"

type TExtractQualifiers = (meshQualifiersXMLPath: string, outputFolderPath: string) => void

const extractQualifiers: TExtractQualifiers = (meshQualifiersXmlFilePath: string, outputFolderPath: string) => {
    const meshReadStream = fs.createReadStream(meshQualifiersXmlFilePath)
    const outputFileName = "qualifiers.csv"
    const qualifiersWriteStream = fs.createWriteStream(`${outputFolderPath}/${outputFileName}`)

    const xmlReadStreamOptions = {
        trim: true,
    }
    const xmlStream = xmlReadStream(meshReadStream, xmlReadStreamOptions)
    const headers = `"id","qualifier","terms"\n`

    qualifiersWriteStream.write(headers)

    xmlStream.on("tag:qualifierrecord", (qualifier) => {
        const id = qualifier.qualifierui
        let { conceptlist, qualifiername } = qualifier
        const terms = []

        if (!Array.isArray(conceptlist)) {
            conceptlist = [ conceptlist ]
        }

        conceptlist.forEach((concept) => {
            let { termlist } = concept
            if (!Array.isArray(termlist)) {
                termlist = [ termlist ]
            }
            termlist.forEach((term) => {
                terms.push(term.string)
            })
        })

        const qualifierEntry = `"${id}","${qualifiername}","${terms.join(";")}"\n`
        qualifiersWriteStream.write(qualifierEntry)
    })
}

export default extractQualifiers
