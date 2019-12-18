import fs from "fs"
import path from "path"

import { sanitizeString } from "./utilities"
import findTreeBranchValue from "./utilities/find_tree_branch_value"
import getNestedObjectValues from "./utilities/get_nested_object_values"

interface IEntry {
    matched: boolean
    value: string[]
}

const meshNamesMapFilePath = path.resolve(__dirname, "mesh_maps", "mesh_names_map.json")
const meshTreeMapFilePath = path.resolve(__dirname, "mesh_maps", "mesh_tree_map.json")
const meshDescUIMapFilePath = path.resolve(__dirname, "mesh_maps", "mesh_descUI_map.json")
const meshNamesMapJSON = fs.readFileSync(meshNamesMapFilePath).toString()
const meshTreeMapJSON = fs.readFileSync(meshTreeMapFilePath).toString()
const meshDescUIMapJSON = fs.readFileSync(meshDescUIMapFilePath).toString()
const meshNamesMap = JSON.parse(meshNamesMapJSON)
const meshTreeMap = JSON.parse(meshTreeMapJSON)
const meshDescUIMap = JSON.parse(meshDescUIMapJSON)

const matchEntryToMeSH = (entryName: string): IEntry => {
    const matchedEntries = []
    const sanitizedEntryName = sanitizeString(entryName)

    if (meshNamesMap.hasOwnProperty(sanitizedEntryName)) {
        // get the tree number
        // find all the relatives
        // add them to the matchedEntries
        // can be multiples descUIs
        const descUIs = meshNamesMap[ sanitizedEntryName ]

        descUIs.forEach((descUI) => {
            const { treeList } = meshDescUIMap[ descUI ]

            treeList.forEach((branch) => {
                const splitedBranch = branch.split(".")
                // sets the branch path one branch up towards the root
                const branchPath = splitedBranch.slice(0, splitedBranch.length - 1)
                const branchValue = findTreeBranchValue(branchPath, meshTreeMap)
                const relatedEntries = getNestedObjectValues(branchValue) // returns list with descriptor UIs

                relatedEntries.forEach((entryUI) => {
                    const sanitizedEntryUI = sanitizeString(entryUI)

                    if (meshDescUIMap.hasOwnProperty(sanitizedEntryUI)) {

                        const terms = meshDescUIMap[ sanitizedEntryUI ].terms
                        matchedEntries.push(...terms)

                    }
                })
            })
        })

        return {
            matched: true,
            value: matchedEntries,
        }

    } else {
        return {
            matched: false,
            value: [ sanitizedEntryName ],
        }
    }
}

export default matchEntryToMeSH
