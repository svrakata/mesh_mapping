import path from "path"
import extractQualifiers from "./extract_qualifiers"

// import generateMaps from "./map_generators/generate_maps"
// import generateMeSHDescUIMap from "./map_generators/mesh_descUI_map"
// // generateMaps()

import getBranchEntries from "./get_branch_entries"
import getDiseases from "./get_diseases"
import matchCSVToMeSH from "./match_csv_to_mesh"
import mergeAndCompareTwoCSVFiles from "./utilities/merge_and_compare_two_csv_files"


import getEntriesAtBranches from "./get_entries_at_branches"
import getSignsAndSymptoms from "./get_signs_symptoms"
import mergeFilteredNonFiltered from "./merge_filtered_not_filtered"

const paths = [
    {
        input: path.resolve(__dirname, "kegg_data/not_filtered"),
        output: path.resolve(__dirname, "mesh_matched_results/not_filtered"),
    },
    // {
    //     input: path.resolve(__dirname, "kegg_data/filtered"),
    //     output: path.resolve(__dirname, "mesh_matched_results/filtered"),
    // },
]

paths.forEach((filePath) => {
    const { input, output } = filePath
    // matchCSVToMeSH(input, output)
})

const notFilteredHerbs = path.resolve(__dirname, "mesh_matched_results/not_filtered", "medicinal_herbs_matched.csv")
const filteredHerbs = path.resolve(__dirname, "mesh_matched_results/filtered", "medicinal_herbs_matched.csv")
// const outputFilePath = path.resolve(__dirname, "mesh_matched_results/combined", "medicinal_herbs.csv")

// mergeAndCompareTwoCSVFiles(notFilteredHerbs, filteredHerbs, outputFilePath)

// const qualifiersXMLFilePath = path.resolve(__dirname, "temp", "qual2020.xml")
// const outputFolderPath = path.resolve(__dirname, "qualifiers")
// extractQualifiers(qualifiersXMLFilePath, outputFolderPath)

// const diseasesFilePath = path.resolve(__dirname, "other", "diseases.csv")
// getDiseases(diseasesFilePath)

// const signsAndSymptomsFilesPath = path.resolve(__dirname, "other", "signs_symptoms.csv")
// getSignsAndSymptoms(signsAndSymptomsFilesPath)

// const bodyPartFilePath = path.resolve(__dirname, "other", "body_parts.csv")
// getSignsAndSymptoms(bodyPartFilePath)

// const filteredFolderPath = path.resolve(__dirname, "mesh_matched_results", "filtered")
// const nonFilteredFolderPath = path.resolve(__dirname, "mesh_matched_results", "not_filtered")
// const mergedFolderPath = path.resolve(__dirname, "mesh_matched_results", "combined")

// mergeFilteredNonFiltered(filteredFolderPath, nonFilteredFolderPath, mergedFolderPath)


// const phrase1 = "pure word blindness"
// const phrase2 = "blindness pure word"

// console.log(isPermutation(phrase1, phrase2))


const outputFilePath = path.resolve(__dirname, "other", "diseases_new.csv")

getEntriesAtBranches({
    branches: [ "C01", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11", "C12", "C13", "C14", "C15", "C16", "C17", "C18", "C19", "C20", "C21", "C22", "C23", "C24", "C25", "C26" ],
    excludeBranches: [ "C23.888" ],
    outputFilePath,
})
