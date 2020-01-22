import fs, { write } from "fs"

import getBranchEntries from "./get_branch_entries"
import filterPluralForms from "./utilities/filter_plural_forms"
import removePermutations from "./utilities/remove_permutations"
import removeRepeatingElements from "./utilities/remove_repeating_elements"

const isPermutation = (phrase: string, variation: string) => {
    const termWords = phrase.split(" ")
    const variationWords = variation.split(" ")

    return termWords.length === variationWords.length && termWords.every((word) => variationWords.includes(word))
}

const getDiseases = (outputFilePath: string) => {

    const writeStream = fs.createWriteStream(outputFilePath)
    const diseases = []

    // the root branches like C, D, B are missing in the descriptors XML
    // tslint:disable-next-line: max-line-length
    const diseaseBranches = [ "C01", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11", "C12", "C13", "C14", "C15", "C16", "C17", "C18", "C19", "C20", "C21", "C22", "C23", "C24", "C25", "C26" ]
    const excludeTreeBranch = "C23.888"
    const idMap = {}

    diseaseBranches.forEach((branchID) => {
        const entries = getBranchEntries(branchID)
        entries.forEach((entry) => {
            const { id, name, terms, treeList } = entry
            const sanitizedName = name.replace(/\-/gi, " ")

            for (const treeBranch of treeList) {
                if (treeBranch.indexOf(excludeTreeBranch) > -1) {
                    return
                }
            }

            if (!idMap.hasOwnProperty(id)) {
                idMap[ id ] = 1
                const filteredTerms = terms
                    .map((term: string) => term.replace(/\-/gi, " "))
                    .filter((term: string) => {
                        if (isPermutation(name, term)) {
                            return false
                        }

                        if (term.includes(",")) {
                            return false
                        }

                        return true
                    })

                const sanitizedTerms = removeRepeatingElements(removePermutations(filterPluralForms(filteredTerms)))
                    .filter((term) => term !== name)
                    .map((term: string) => `"${term}"`)

                diseases.push({ id, name: sanitizedName, terms: sanitizedTerms })


                // terms.forEach((term) => {
                //     writeStream.write(`"${id}","${term}"\n`)
                // })
            }
        })
    })


    diseases.sort((prev, next) => {
        const compare = prev.name.split(" ").length - next.name.split(" ").length
        if (compare === 0) {
            return prev.name.localeCompare(next.name)
        } else {
            return compare
        }
    })
    diseases.forEach(
        ({ id, name, terms }) => writeStream.write(`"${id}","${name}",${terms.length ? terms.join(",") : ""}\n`),
    )
}

export default getDiseases
