import fs from "fs"
import getBranchEntries from "./get_branch_entries"

const isPermutation = (phrase: string, variation: string) => {
    const termWords = phrase.split(" ")
    const variationWords = variation.split(" ")

    return termWords.length === variationWords.length && termWords.every((word) => variationWords.includes(word))
}

const getSignsAndSymptoms = (outputFilePath: string) => {
    const writeStream = fs.createWriteStream(outputFilePath)
    const signsAndSymptomsBranch = "C23.888"
    const entries = getBranchEntries(signsAndSymptomsBranch)
    const idMap = {}

    entries.forEach((entry) => {
        const { id, name, terms } = entry

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
        }
    })
}

export default getSignsAndSymptoms
