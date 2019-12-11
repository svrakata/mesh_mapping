import fs from "fs"
import flow from "xml-flow"
import { sanitizeString } from "./utilities"

const generateMeSHNameMap = (meshXMLFilePath: string, mapJSONFilePath: string) => {
    const meshReadStream = fs.createReadStream(meshXMLFilePath)
    const hashWriteStream = fs.createWriteStream(mapJSONFilePath)

    const xmlStream = flow(meshReadStream)
    const meshNameMap = {}

    // hashWriteStream.write("{")

    // gets the name of each descriptor (aka heading)
    xmlStream.on("tag:descriptorrecord", (record) => {
        const { descriptorname, conceptlist, descriptorui, treenumberlist } = record
        const name = sanitizeString(descriptorname)
        let terms = []

        const treeList = Array.isArray(treenumberlist) ? treenumberlist : [ treenumberlist ]
        const value = {
            descriptorUI: descriptorui,
            treeList,
        }

        if (!meshNameMap[ name ]) {
            meshNameMap[ name ] = value
            // hashWriteStream.write(`"${name}":${JSON.stringify(value)}`)
            // hashWriteStream.write(",")
        }

        if (Array.isArray(conceptlist)) {
            terms = conceptlist.reduce((list, current) => list.concat(current.termlist), [])
        } else {
            terms = Array.from(conceptlist.termlist)
        }

        terms.forEach((term) => {
            const termName = sanitizeString(term.string)

            if (!meshNameMap[ termName ]) {
                meshNameMap[ termName ] = value
                // hashWriteStream.write(`"${termName}":${JSON.stringify(value)}`)
                // hashWriteStream.write(",")
            }
        })
    })

    xmlStream.on("end", () => {
        // hashWriteStream.write("}")
        fs.writeFileSync(mapJSONFilePath, JSON.stringify(meshNameMap))
    })

    xmlStream.on("error", (err) => {
        console.error(err)
    })

    return meshNameMap
}

export default generateMeSHNameMap
