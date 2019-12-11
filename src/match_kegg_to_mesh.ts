import fs from "fs"
import path from "path"

import findTreeBranchValue from "./find_tree_branch_value"
import getNestedObjectValues from "./get_nested_object_values"
import { sanitizeString } from "./utilities"

const meshNamesMapFilePath = path.resolve(__dirname, "mesh_maps", "mesh_names_map.json")
const meshTreeMapFilePath = path.resolve(__dirname, "mesh_maps", "mesh_tree_map.json")
const meshDescUIMapFilePath = path.resolve(__dirname, "mesh_maps", "mesh_descUI_map.json")
const meshNamesMapJSON = fs.readFileSync(meshNamesMapFilePath).toString()
const meshTreeMapJSON = fs.readFileSync(meshTreeMapFilePath).toString()
const meshDescUIMapJSON = fs.readFileSync(meshDescUIMapFilePath).toString()
const meshNamesMap = JSON.parse(meshNamesMapJSON)
const meshTreeMap = JSON.parse(meshTreeMapJSON)
const meshDescUIMap = JSON.parse(meshDescUIMapJSON)

const matchKeggToMesh = (keggList: string[]) => {
    const missmatchedEntries = []
    const matchedEntries = []

    keggList.forEach((keggEntryName) => {
        const sanitizedKeggEntryName = sanitizeString(keggEntryName)
        if (meshNamesMap.hasOwnProperty(sanitizedKeggEntryName)) {
            // get the tree number
            // find all the relatives
            // add them to the matchedEntries
            const { treeList } = meshNamesMap[ sanitizedKeggEntryName ]
            treeList.forEach((branch) => {
                const splitedBranch = branch.split(".")
                const branchPath = splitedBranch.slice(0, splitedBranch.length - 1)

                const branchValue = findTreeBranchValue(branchPath, meshTreeMap)
                const relatedEntries = getNestedObjectValues(branchValue) // return list with descriptor UIs

                relatedEntries.forEach((entryUI) => {
                    const sanitizedEntryUI = sanitizeString(entryUI)
                    if (meshDescUIMap.hasOwnProperty(sanitizedEntryUI)) {
                        matchedEntries.push(meshDescUIMap[ sanitizedEntryUI ])
                    }
                })

                // get the names from mirror hash of the names hash
                // can use lodash: _.invert(hash)


                // const relatedEntriesNames = Object.keys()

            })

        } else {
            // all kegg items that doesn't match the mesh DB
            missmatchedEntries.push(keggEntryName)
        }
    })

    return {
        matchedEntries,
        missmatchedEntries,
    }
}

export default matchKeggToMesh
