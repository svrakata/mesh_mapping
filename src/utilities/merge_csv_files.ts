import parser from "csv-parse"
import fs from "fs"
import path from "path"


const mergeAndCompareTwoCSVFiles = (file1Path: string, file2Path: string) => {
    // cycle file 1
    // compare to each line of file 2

    const csvParser = parser({
        columns: true,
        trim: true,
    })

    csvParser.on("readable", () => {
        while (true) {

        }
    })

}

export default mergeAndCompareTwoCSVFiles
