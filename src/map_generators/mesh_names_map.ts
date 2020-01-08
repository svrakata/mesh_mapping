import fs from "fs"
import xmlReadStream from "xml-flow"
import sanitizeString from "../utilities/sanitize_string"

const generateMeSHNameMap = (meshXMLFilePath: string, mapJSONFilePath: string) => {
    const meshReadStream = fs.createReadStream(meshXMLFilePath)

    const xmlReadStreamOptions = {
        trim: true,
    }

    const xmlStream = xmlReadStream(meshReadStream, xmlReadStreamOptions)
    const map = {}

    xmlStream.on("tag:descriptorrecord", (record) => {
        const { descriptorname, conceptlist, descriptorui } = record
        const name = sanitizeString(descriptorname)
        const sanitizedDescID = sanitizeString(descriptorui)
        let terms = []

        if (Array.isArray(conceptlist)) {
            terms = conceptlist.reduce((acumulatedTerms, current) => acumulatedTerms.concat(current.termlist), [])
        } else {
            terms = Array.from(conceptlist.termlist)
        }

        if (!map.hasOwnProperty(name)) {
            map[ name ] = [ sanitizedDescID ]
        } else {
            if (!map[ name ].includes(sanitizedDescID)) {
                map[ name ] = [ ...map[ name ], sanitizedDescID ]
            }
        }

        terms.forEach((term) => {
            const termName = sanitizeString(term.string)
            if (!map.hasOwnProperty(termName)) {
                map[ termName ] = [ sanitizedDescID ]
            } else {
                if (!map[ termName ].includes(sanitizedDescID)) {
                    map[ termName ] = [ ...map[ termName ], sanitizedDescID ]
                }
            }
        })
    })

    xmlStream.on("end", () => {
        fs.writeFileSync(mapJSONFilePath, JSON.stringify(map))
    })

    xmlStream.on("error", (err) => {
        console.error(err)
    })
}


export default generateMeSHNameMap
