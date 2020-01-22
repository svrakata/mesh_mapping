import fs from "fs"
import path from "path"
import getBranchEntries from "./get_branch_entries"
import filterPluralForms from "./utilities/filter_plural_forms"
import removePermutations from "./utilities/remove_permutations"
import removeRepeatingElements from "./utilities/remove_repeating_elements"

interface IOptions {
    branches: string[]
    excludeBranches?: string[]
    outputFilePath: string
}

const getEntriesAtBranches = (options: IOptions) => {
    const { branches, excludeBranches, outputFilePath } = options
    const writeStream = fs.createWriteStream(outputFilePath)

    const parsedEntries = []
    const repeatingEntriesIDMap = {}

    branches.forEach((branchID) => {
        const meshEntries = getBranchEntries(branchID)

        meshEntries.forEach((meshEntry) => {
            // the first item in the terms is the name
            const { id, name, terms, treeList } = meshEntry

            if (entryIsFromExcludedBranch(excludeBranches, treeList)) {
                return
            }

            // excludes entries that occurs at more than one branch
            if (!repeatingEntriesIDMap.hasOwnProperty(id)) {
                repeatingEntriesIDMap[ id ] = 1

                const sanitizedTerms = removeRepeatingElements(
                    filterPluralForms(
                        removePermutations(
                            sanitizeTerms(terms))))

                parsedEntries.push({
                    id,
                    name: sanitizeString(name),
                    terms: sanitizedTerms
                        .slice(1)
                        .map((term: string) => `"${term}"`),
                })
            }

        })

    })

    parsedEntries.sort((prev, next) => {
        const lengthDifference = prev.name.split(" ").length - next.name.split(" ").length
        if (lengthDifference === 0) {
            return prev.name.localeCompare(next.name)
        } else {
            return lengthDifference
        }
    })

    parsedEntries.forEach(
        ({ id, name, terms }) => writeStream.write(`"${id}","${name}",${terms.length ? terms.join(",") : ""}\n`),
    )

}

const extractVariations = (terms: string[], outputFilePath: string) => {
    const outputFileName = path.basename(outputFilePath)
    const outFolder = path.dirname(outputFilePath)
    const outFilePath = `${outFolder}/${outputFileName}_variations.csv`
    const writeStream = fs.createWriteStream(outFilePath)

    terms.map((term: string) => {
        if (term) {
            // check for dys a begining and map it
        }
    })
}

const entryIsFromExcludedBranch = (excludedBranches: string[], entryTreeList: string[]) => {
    // see if exclusion can happend at tree traversal (no time now)
    for (const branch of entryTreeList) {
        for (const excBranch of excludedBranches) {
            if (branch.indexOf(excBranch) > -1) {
                return true
            }
        }
    }
    return false
}

const sanitizeTerms = (terms: string[]) => (terms).map((term) => sanitizeString(term))
const sanitizeString = (str: string) => str.replace(/\-/gi, " ")

export default getEntriesAtBranches
