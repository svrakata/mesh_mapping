import fs from "fs"
import path from "path"

import generateMeSHDescUIMap from "./mesh_descUI_map"
import generateMeSHNameMap from "./mesh_names_map"
import generateMeSHTreeMap from "./mesh_tree_map"


const meshMapsDIRName = "mesh_maps"
fs.mkdirSync(path.resolve(__dirname, meshMapsDIRName), { recursive: true })

// test
generateMeSHTreeMap(
    // MeSH xml to read from
    path.resolve(__dirname, "temp", "document.xml"),
    // JSON to spit to
    path.resolve(__dirname, meshMapsDIRName, "mesh_map_test.json"),
)

generateMeSHNameMap(
    path.resolve(__dirname, "temp", "desc2020.xml"),
    path.resolve(__dirname, meshMapsDIRName, "mesh_names_map.json"),
)

generateMeSHDescUIMap(
    path.resolve(__dirname, "temp", "desc2020.xml"),
    path.resolve(__dirname, meshMapsDIRName, "mesh_descUI_map.json"),
)
