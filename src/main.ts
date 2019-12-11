import fs from "fs"
import path from "path"

import matchKeggToMesh from "./match_kegg_to_mesh"
import generateMeSHDescUIMap from "./mesh_descUI_map"
import generateMeSHNameMap from "./mesh_names_map"


const meshMapsDIRName = "mesh_maps"
fs.mkdirSync(path.resolve(__dirname, meshMapsDIRName), { recursive: true })

// generateMeSHTreeMap(
//     // MeSH xml to read
//     path.resolve(__dirname, "temp", "document.xml"),
//     // JSON to spit to
//     path.resolve(__dirname, meshMapsDIRName, "mesh_map_test.json"),
// )


// generateMeSHNameMap(
//     path.resolve(__dirname, "temp", "desc2020.xml"),
//     path.resolve(__dirname, meshMapsDIRName, "mesh_names_map.json"),
// )

// generateMeSHDescUIMap(
//     path.resolve(__dirname, "temp", "desc2020.xml"),
//     path.resolve(__dirname, meshMapsDIRName, "mesh_descUI_map.json"),
// )

const keggList = fs.readFileSync(path.resolve(__dirname, "temp", "kegg_list.csv")).toString()

const keggListSplited = keggList.split("\n")

console.log(matchKeggToMesh(keggListSplited))
