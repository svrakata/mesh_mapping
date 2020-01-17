import parser from "csv-parse"
import fs from "fs"
import path from "path"

import matchEntryToMeSH from "./match_entry_to_mesh"


/*
    Takes input folder which is supposed to contain CSV files with proper headers
    Read all the files and match each entry to the MeSH structure.
    Generates 1 file one with all matched and missmatched entries.
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

        const matchedMap = {}
        const entries = []

        let matchedCount = 0
        let missMatchedCount = 0

        csvParse.on("readable", () => {
            let chunk = csvParse.read()

            while (chunk !== null) {

                if (chunk.hasOwnProperty(csvHeader)) {
                    const entry = matchEntryToMeSH(chunk[ csvHeader ])
                    entry.value.forEach((entryValue) => {
                        const { name, matched } = entryValue

                        if (!matchedMap.hasOwnProperty(name)) {
                            matchedMap[ entryValue.name ] = 1
                            entries.push(entryValue)
                        }

                        if (matched === 1) {
                            matchedCount++
                        } else {
                            missMatchedCount++
                        }
                    })

                    chunk = csvParse.read()
                } else {
                    throw new Error(`The header "${csvHeader}" is not defined in ${file}`)
                }

            }
        })

        csvParse.on("end", () => {
            console.log(`File "${file}" processed.`)
            console.log(`${matchedCount} entries matched in MeSH.`)
            console.log(`${missMatchedCount} entries not matched in MeSH.\n`)

            const outputfileName = `${path.parse(file).name}.csv`
            const outputfilePath = path.resolve(__dirname, outputFolderPath, outputfileName)
            const writeStream = fs.createWriteStream(outputfilePath)
            const outputCSVHeader = `"meshID","name","terms","matched"\n`

            writeStream.write(outputCSVHeader)

            entries.forEach((entry) => {
                const { id, name, terms, matched } = entry
                writeStream.write(`"${id}","${name}","${terms.join(";")}","${matched}"\n`)
            })
        })

    })

}

export default matchCSVToMeSH
