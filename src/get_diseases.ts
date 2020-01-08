import fs, { write } from "fs"

import getBranchEntries from "./get_branch_entries"

const getDiseases = (outputFilePath: string) => {

    const writeStream = fs.createWriteStream(outputFilePath)

    // the root branches like C, D, B are missing in the descriptors XML
    // tslint:disable-next-line: max-line-length
    const diseaseBranches = [ "C01", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11", "C12", "C13", "C14", "C15", "C16", "C17", "C18", "C19", "C20", "C21", "C22", "C23", "C24", "C25", "C26"]
    const headers = `"id","name","terms"\n`
    const idMap = { }


    writeStream.write(headers)

    diseaseBranches.forEach((branchID) => {
        const entries = getBranchEntries(branchID)
        entries.forEach((entry) => {
            const { id, name, terms } = entry

            if (!idMap.hasOwnProperty(id)) {
                idMap[id] = 1
                writeStream.write(`"${id}","${name}","${terms.join(";")}"\n`)
                // writeStream.write(`"${id}","${name}"\n`)
                // terms.forEach((term) => {
                //     writeStream.write(`"","","${term}"\n`)
                // })
            }
        })
    })
}

export default getDiseases
