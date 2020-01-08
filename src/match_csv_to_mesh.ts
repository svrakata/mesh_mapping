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

    // the prop should be passed as option the data should be handled if no property is passed
    const csvHeader = "name"
    const files = fs.readdirSync(dataFolderPath)

    files.forEach((file) => {
        const filePath = path.resolve(__dirname, dataFolderPath, file)
        const fileData = fs.readFileSync(filePath).toString()
        const csvParse = parser(fileData, parserOptions)
        const matched = []
        const missMatched = []
        const matchedMap = {}
        let matchedCount = 0

        csvParse.on("readable", () => {
            let chunk = csvParse.read()

            while (chunk !== null) {

                if (chunk.hasOwnProperty(csvHeader)) {
                    const entry = matchEntryToMeSH(chunk[ csvHeader ])

                    if (entry.matched) {
                        entry.value.forEach((entryValue) => {
                            if (!matchedMap.hasOwnProperty(entryValue.name)) {

                                matchedMap[ entryValue.name ] = 1
                                matched.push(entryValue)
                            }
                        })
                        matchedCount++
                    } else {
                        if (!matchedMap.hasOwnProperty(entry.value[ 0 ].name)) {
                            missMatched.push(...entry.value)
                        }
                    }

                    chunk = csvParse.read()
                } else {
                    throw new Error(`The header "${csvHeader}" is not defined in ${file}`)
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

            const outputCSVHeader = `"id","name","terms"`

            matchedWriteStream.write(`${outputCSVHeader}\n`)
            missMatchedWriteStream.write(`"name"\n`)

            matched.forEach((entry) => {
                const { id, name, terms } = entry
                matchedWriteStream.write(`"${id}","${name}","${terms.join(";")}"\n`)
            })

            missMatched.forEach((entry) => {
                const { name } = entry
                missMatchedWriteStream.write(`"${name}"\n`)
            })

        })

    })

}

export default matchCSVToMeSH
