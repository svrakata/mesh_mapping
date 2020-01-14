import fs from "fs"
import path from "path"
import { promisify } from "util"
import mergeAndCompareTwoCSVFiles from "./utilities/merge_and_compare_two_csv_files"


const mergeFilteredNonFiltered = async (
    notFilteredFolderPath: string,
    filteredFolderPath: string,
    outputFolderPath: string,
) => {

    const readDir = promisify(fs.readdir)
    const filteredFiles = await readDir(filteredFolderPath)
    const notFilteredFiles = await readDir(notFilteredFolderPath)

    notFilteredFiles.forEach((nfFile) => {
        filteredFiles.forEach((fFile) => {
            if (nfFile === fFile) {
                const fFilePath = path.resolve(__dirname, filteredFolderPath, fFile)
                const nfFilePath = path.resolve(__dirname, notFilteredFolderPath, nfFile)
                const outputFilePath = path.resolve(__dirname, outputFolderPath, fFile)
                mergeAndCompareTwoCSVFiles(nfFilePath, fFilePath, outputFilePath)
            }
        })
    })
}

export default mergeFilteredNonFiltered
