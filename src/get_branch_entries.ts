import fs from "fs"
import path from "path"
import findTreeBranchValue from "./utilities/find_tree_branch_value"
import getNestedObjectValues from "./utilities/get_nested_object_values"
import sanitizeString from "./utilities/sanitize_string"

const meshNamesMapFilePath = path.resolve(__dirname, "mesh_maps", "mesh_names_map.json")
const meshTreeMapFilePath = path.resolve(__dirname, "mesh_maps", "mesh_tree_map.json")
const meshDescUIMapFilePath = path.resolve(__dirname, "mesh_maps", "mesh_descUI_map.json")
const meshNamesMapJSON = fs.readFileSync(meshNamesMapFilePath).toString()
const meshTreeMapJSON = fs.readFileSync(meshTreeMapFilePath).toString()
const meshDescUIMapJSON = fs.readFileSync(meshDescUIMapFilePath).toString()
const meshNamesMap = JSON.parse(meshNamesMapJSON)
const meshTreeMap = JSON.parse(meshTreeMapJSON)
const meshDescUIMap = JSON.parse(meshDescUIMapJSON)

const getBranchEntries = (branchID: string) => {
    const branchValue = findTreeBranchValue(branchID.split("."), meshTreeMap)
    const relatedEntries = getNestedObjectValues(branchValue) // returns list with descriptor UIs
    const matchedEntries = []


    relatedEntries.forEach((entryUI) => {
        const sanitizedEntryUI = sanitizeString(entryUI)

        if (meshDescUIMap.hasOwnProperty(sanitizedEntryUI)) {
            const { name, terms, treeList } = meshDescUIMap[ sanitizedEntryUI ]
            matchedEntries.push({ name, terms, id: sanitizedEntryUI, treeList })
        }
    })

    return matchedEntries
}

export default getBranchEntries
