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
        const terms = []
        let { conceptlist, qualifiername } = qualifier
        let splitedNames = []
        let qualifierEntry = ""

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

        if (qualifiername.includes("&")) {
            splitedNames = qualifiername
                .split("&")
                .map((name) => name.trim())
            const qName = splitedNames.join(" and ")
            qualifierEntry = `"${id}","${qName}"`
            // qualifiersWriteStream.write(qualifierEntry)
            splitedNames.forEach((name) => {
                if (!terms.includes(name)) {
                    terms.push(name)
                }
                // qualifiersWriteStream.write(`"","","${name}"\n`)
            })
        } else {
            qualifierEntry = `"${id}","${qualifiername}"`
            // qualifiersWriteStream.write(qualifierEntry)
        }

        // terms.forEach((term) => {
        //     if (!splitedNames.includes(term)) {
        //         qualifiersWriteStream.write(`"","","${term}"\n`)
        //     }
        // })
        qualifiersWriteStream.write(`${qualifierEntry},"${terms.join(";")}"\n`)
    })
}

export default extractQualifiers
