import path from "path"
import extractQualifiers from "./extract_qualifiers"

// import generateMaps from "./map_generators/generate_maps"
// import generateMeSHDescUIMap from "./map_generators/mesh_descUI_map"
// // generateMaps()

import getBranchEntries from "./get_branch_entries"
import getDiseases from "./get_diseases"
import matchCSVToMeSH from "./match_csv_to_mesh"
import mergeAndCompareTwoCSVFiles from "./utilities/merge_and_compare_two_csv_files"

const paths = [
    {
        input: path.resolve(__dirname, "kegg_data/not_filtered"),
        output: path.resolve(__dirname, "mesh_matched_results/not_filtered"),
    },
    {
        input: path.resolve(__dirname, "kegg_data/filtered"),
        output: path.resolve(__dirname, "mesh_matched_results/filtered"),
    },
]

paths.forEach((filePath) => {
    const { input, output } = filePath
    // matchCSVToMeSH(input, output)
})

const notFilteredHerbs = path.resolve(__dirname, "mesh_matched_results/not_filtered", "medicinal_herbs_matched.csv")
const filteredHerbs = path.resolve(__dirname, "mesh_matched_results/filtered", "medicinal_herbs_matched.csv")
const outputFilePath = path.resolve(__dirname, "mesh_matched_results/combined", "medicinal_herbs.csv")

// mergeAndCompareTwoCSVFiles(notFilteredHerbs, filteredHerbs, outputFilePath)

// const qualifiersXMLFilePath = path.resolve(__dirname, "temp", "qual2020.xml")
// const outputFolderPath = path.resolve(__dirname, "qualifiers")
// extractQualifiers(qualifiersXMLFilePath, outputFolderPath)

const diseasesFilePath = path.resolve(__dirname, "diseases", "diseases.csv")
getDiseases(diseasesFilePath)
