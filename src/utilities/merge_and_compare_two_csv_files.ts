import parser from "csv-parse"
import fs from "fs"

const mergeAndCompareTwoCSVFiles = (file1Path: string, file2Path: string, outputFilePath: string) => {
    const csvParserFile1 = parser({
        columns: true,
        trim: true,
    })

    const csvParserFile2 = parser({
        columns: true,
        trim: true,
    })

    const file1ReadStream = fs.createReadStream(file1Path)
    const file2ReadStream = fs.createReadStream(file2Path)
    const writeStream = fs.createWriteStream(outputFilePath)
    const idMap = { }

    writeStream.write(`"id","name","terms"\n`)

    csvParserFile1.on("readable", () => {
        while (true) {
            const file1Chunk = csvParserFile1.read()
            if (file1Chunk === null) {
                break
            }

            const { id, name, terms } = file1Chunk

            if (!idMap.hasOwnProperty(id)) {
                idMap[id] = 1
                writeStream.write(`"${id}","${name}","${terms}"\n`)
            }
        }
    })

    csvParserFile2.on("readable", () => {
        while (true) {
            const file2Chunk = csvParserFile2.read()
            if (file2Chunk === null) {
                break
            }

            const { id, name, terms } = file2Chunk

            if (!idMap.hasOwnProperty(id)) {
                idMap[id] = 1
                writeStream.write(`"${id}","${name}","${terms}"\n`)
            }

        }
    })

    file1ReadStream.pipe(csvParserFile1)

    file1ReadStream.on("end", () => {
        file2ReadStream.pipe(csvParserFile2)
    })

}

export default mergeAndCompareTwoCSVFiles
