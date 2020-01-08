import path from "path"
import extractQualifiers from "./extract_qualifiers"

// import generateMaps from "./map_generators/generate_maps"
// import generateMeSHDescUIMap from "./map_generators/mesh_descUI_map"
import matchCSVToMeSH from "./match_csv_to_mesh"

const dataFolderName = "kegg_data/not_filtered"
const outputFolderName = "mesh_matched_results/not_filtered"
const dataFolderPath = path.resolve(__dirname, dataFolderName)
const outputFolderPath = path.resolve(__dirname, outputFolderName)

// // generateMaps()
matchCSVToMeSH(dataFolderPath, outputFolderPath)

// const qualifiersXMLFilePath = path.resolve(__dirname, "temp", "qual2020.xml")
// const outputFolderPath = path.resolve(__dirname, "qualifiers")
// extractQualifiers(qualifiersXMLFilePath, outputFolderPath)
