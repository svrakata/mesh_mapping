import path from "path"

import generateMaps from "./map_generators/generate_maps"
import generateMeSHDescUIMap from "./map_generators/mesh_descUI_map"
import matchCSVToMeSH from "./match_csv_to_mesh"

const dataFolderName = "kegg_data/filtered"
const outputFolderName = "mesh_matched_results/filtered"
const dataFolderPath = path.resolve(__dirname, dataFolderName)
const outputFolderPath = path.resolve(__dirname, outputFolderName)

// generateMaps()
matchCSVToMeSH(dataFolderPath, outputFolderPath)

