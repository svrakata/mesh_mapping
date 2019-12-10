// get all tree numbers and descriptor ui

import fs from "fs"
import path from "path"
import generateMeSHTreeMap from "./mesh_tree_map"

const meshMapsDIRName = "mesh_maps"
fs.mkdirSync(path.resolve(__dirname, meshMapsDIRName), { recursive: true })

generateMeSHTreeMap(
    // MeSH xml to read
    path.resolve(__dirname, "temp", "document.xml"),
    // JSON to spit to
    path.resolve(__dirname, meshMapsDIRName, "mesh_map_test.json"),
)


