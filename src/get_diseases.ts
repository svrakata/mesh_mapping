import fs, { write } from "fs"

import getBranchEntries from "./get_branch_entries"

const isPermutation = (phrase: string, variation: string) => {
    const termWords = phrase.split(" ")
    const variationWords = variation.split(" ")

    return termWords.length === variationWords.length && termWords.every((word) => variationWords.includes(word))
}

const getDiseases = (outputFilePath: string) => {

    const writeStream = fs.createWriteStream(outputFilePath)

    // the root branches like C, D, B are missing in the descriptors XML
    // tslint:disable-next-line: max-line-length
    const diseaseBranches = [ "C01", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11", "C12", "C13", "C14", "C15", "C16", "C17", "C18", "C19", "C20", "C21", "C22", "C23", "C24", "C25", "C26" ]
    const headers = `"id","name","terms"\n`
    const excludeTreeBranch = "C23.888"
    const idMap = {}

    writeStream.write(headers)

    diseaseBranches.forEach((branchID) => {
        const entries = getBranchEntries(branchID)
        entries.forEach((entry) => {
            const { id, name, terms, treeList } = entry

            for (const treeBranch of treeList) {
                if (treeBranch.indexOf(excludeTreeBranch) > -1) {
                    return
                }
            }

            if (!idMap.hasOwnProperty(id)) {
                idMap[ id ] = 1
                const filteredTerms = terms.filter((term: string) => {
                    if (isPermutation(name, term)) {
                        return false
                    }

                    if (term.indexOf(name) > -1) {
                        return false
                    }

                    if (term.includes(",")) {
                        return false
                    }

                    return true
                })

                writeStream.write(`"${id}","${name}","${filteredTerms.join(";")}"\n`)
                // terms.forEach((term) => {
                //     writeStream.write(`"${id}","${term}"\n`)
                // })
            }
        })
    })
}

export default getDiseases
