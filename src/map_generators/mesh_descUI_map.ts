import fs from "fs"
import xmlReadStream from "xml-flow"
import sanitizeString from "../utilities/sanitize_string"

const generateMeSHDescUIMap = (meshXMLFilePath: string, mapJSONFilePath: string) => {
    const meshReadStream = fs.createReadStream(meshXMLFilePath)
    const hashWriteStream = fs.createWriteStream(mapJSONFilePath)

    const xmlReadStreamOptions = {
        trim: true,
    }

    const xmlStream = xmlReadStream(meshReadStream, xmlReadStreamOptions)

    hashWriteStream.write("{")

    xmlStream.on("tag:descriptorrecord", (record) => {
        const { descriptorname, conceptlist, descriptorui, treenumberlist } = record
        const name = sanitizeString(descriptorname)
        const descID = sanitizeString(descriptorui)
        let terms = []
        const treeList = Array.isArray(treenumberlist) ? treenumberlist : [ treenumberlist ]

        if (Array.isArray(conceptlist)) {
            terms = conceptlist.reduce((acumulatedTerms, current) => acumulatedTerms.concat(current.termlist), [])
        } else {
            terms = Array.from(conceptlist.termlist)
        }
        const value = {
            name,
            terms: terms.map((term) => sanitizeString(term.string)),
            treeList,
        }

        hashWriteStream.write(`"${descID}":${JSON.stringify(value)}`)
        hashWriteStream.write(",")

    })

    xmlStream.on("end", () => {
        // writing this to avoid the last trailing comma problem when writing to json with streams
        hashWriteStream.write(`"end_of_json": "ignore if parsing"`)
        hashWriteStream.write("}")
    })

    xmlStream.on("error", (err) => {
        console.error(err)
    })
}

export default generateMeSHDescUIMap
