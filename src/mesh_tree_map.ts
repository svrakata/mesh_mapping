import fs from "fs"
import flow from "xml-flow"
import addDescriptorUI from "./add_tree_branch_value"

// generates map with the tree numbers
const generateMeSHTreeMap = (meshXMLFilePath: string, mapJSONFilePath: string) => {
    const readStream = fs.createReadStream(meshXMLFilePath)
    const meshXMLStream = flow(readStream)
    const meshTreeNumbersMap = {}

    meshXMLStream.on("tag:descriptorrecord", (record) => {
        const { descriptorui, treenumberlist } = record
        if (treenumberlist === undefined) {
            return
        }

        if (Array.isArray(treenumberlist)) {
            treenumberlist.forEach((treeNumber: string) => {
                const path = treeNumber.split(".")
                addDescriptorUI(path, meshTreeNumbersMap, descriptorui)
            })
        } else {
            const path = treenumberlist.split(".")
            addDescriptorUI(path, meshTreeNumbersMap, descriptorui)
        }
    })

    meshXMLStream.on("end", () => {
        fs.writeFileSync(mapJSONFilePath, JSON.stringify(meshTreeNumbersMap))
    })

}

export default generateMeSHTreeMap
