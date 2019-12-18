import parser from "csv-parse"
import fs from "fs"
import path from "path"

import matchEntryToMeSH from "./match_entry_to_mesh"


/*
    Takes input folder which is supposed to contain CSV files with proper headers
    Read all the files and match each entry to the MeSH structure.
    Generates 2 files one with all matched entries plus related terms, the second one is with the missmatched entries.
*/


const matchCSVToMeSH = (dataFolderPath: string, outputFolderPath: string) => {
    const parserOptions = {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    }

    // the prop should be passed/ the data should be handled if no property is passed
    const propToRead = "name"
    const files = fs.readdirSync(dataFolderPath)

    files.forEach((file) => {
        const filePath = path.resolve(__dirname, dataFolderPath, file)
        const fileData = fs.readFileSync(filePath).toString()
        const csvParse = parser(fileData, parserOptions)
        const matched = []
        const missMatched = []
        let matchedCount = 0
        const matchedMap = {}

        csvParse.on("readable", () => {
            let chunk = csvParse.read()

            while (chunk !== null) {

                if (chunk.hasOwnProperty(propToRead)) {
                    const entry = matchEntryToMeSH(chunk[ propToRead ])

                    if (entry.matched) {
                        entry.value.forEach((entryValue) => {
                            if (!matchedMap.hasOwnProperty(entryValue)) {
                                matchedMap[ entryValue ] = 1
                                matched.push(entryValue)
                            }
                        })
                        matchedCount++
                    } else {
                        if (!matchedMap.hasOwnProperty(entry.value[ 0 ])) {
                            missMatched.push(...entry.value)
                        }
                    }

                    chunk = csvParse.read()
                } else {
                    throw new Error(`The header "${propToRead}" is not defined in ${file}`)
                }

            }
        })

        csvParse.on("end", () => {
            console.log(`File "${file}" processed.`)
            console.log(`${matchedCount} entries matched in MeSH.`)
            console.log(`${missMatched.length} entries not matched in MeSH.\n`)

            const fileName = path.parse(file).name
            const matchedOutputFileName = `${fileName}_matched.csv`
            const missmatchedOutputFileName = `${fileName}_missmatched.csv`
            const matchedOutputFilePath = path.resolve(__dirname, outputFolderPath, matchedOutputFileName)
            const missMatchedOutputFilePath = path.resolve(__dirname, outputFolderPath, missmatchedOutputFileName)
            const matchedWriteStream = fs.createWriteStream(matchedOutputFilePath)
            const missMatchedWriteStream = fs.createWriteStream(missMatchedOutputFilePath)

            matchedWriteStream.write(`"${propToRead}"\n`)
            missMatchedWriteStream.write(`"${propToRead}"\n`)

            matched.forEach((entry) => {
                matchedWriteStream.write(`"${entry}"\n`)
            })

            missMatched.forEach((entry) => {
                missMatchedWriteStream.write(`"${entry}"\n`)
            })

        })

    })

}

export default matchCSVToMeSH
