import parser from "csv-parse"
import fs from "fs"
import path from "path"

import matchToMesh from "./match_to_mesh"

const matchCSVToMeSH = (dataFolderPath: string, outputFolderPath: string) => {
    const parserOptions = {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    }

    const propToRead = "name"
    const files = fs.readdirSync(dataFolderPath)

    files.forEach((file) => {
        const filePath = path.resolve(__dirname, dataFolderPath, file)
        const fileData = fs.readFileSync(filePath).toString()
        const csvParse = parser(fileData, parserOptions)
        const matched = []
        const missMatched = []
        let matchedCount = 0

        csvParse.on("readable", () => {
            let chunk = csvParse.read()

            while (chunk !== null) {

                if (chunk.hasOwnProperty(propToRead)) {

                    const entry = matchToMesh(chunk[ propToRead ])

                    if (entry.matched) {
                        matched.push(...entry.value)
                        matchedCount++
                    } else {
                        missMatched.push(entry.value)
                    }

                    chunk = csvParse.read()
                } else {
                    throw new Error(`The header ${propToRead} is not defined in ${file}`)
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
