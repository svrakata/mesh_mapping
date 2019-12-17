import { createWriteStream } from "fs"

type TWriteToCSV = (iterable: string[], outputFilePath: string, header?: string[]) => void

const writeToCSV: TWriteToCSV = (iterable, outputFilePath: string, header: string[]) => {
    const writeStream = createWriteStream(outputFilePath)

    if (header) {
        const csvHeader = header
            .map((title) => `"${title}"\n`)
            .join(", ")
        writeStream.write(csvHeader)
    }

    iterable.forEach((item: string) => {
        writeStream.write(`"${item}"\n`)
    })
}

export default writeToCSV
