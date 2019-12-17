import path from "path"

import matchCSVToMeSH from "./match_csv_to_mesh"

const dataFolderName = "kegg_data/not_filtered"
const outputFolderName = "mesh_matched_results"
const dataFolderPath = path.resolve(__dirname, dataFolderName)
const outputFolderPath = path.resolve(__dirname, outputFolderName)

matchCSVToMeSH(dataFolderPath, outputFolderPath)
