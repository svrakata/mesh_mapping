import fs from "fs"
import getBranchEntries from "./get_branch_entries"
import filterPluralForms from "./utilities/filter_plural_forms"
import isPermutation from "./utilities/is_permutation"
import removePermutations from "./utilities/remove_permutations"
import removeRepeatingElements from "./utilities/remove_repeating_elements"

const getBodyRegions = (outputFilePath: string) => {
    const writeStream = fs.createWriteStream(outputFilePath)
    const signsAndSymptomsBranch = "A01"
    const entries = getBranchEntries(signsAndSymptomsBranch)
    const idMap = {}
    const symptoms = []

    entries.forEach((entry) => {
        const { id, name, terms } = entry
        const sanitizedName = name.replace(/\-/gi, " ")

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
            symptoms.push({ id, name: sanitizedName, terms: sanitizedTerms })
        }
    })

    symptoms.sort((prev, next) => {
        const compare = prev.name.split(" ").length - next.name.split(" ").length
        if (compare === 0) {
            return prev.name.localeCompare(next.name)
        } else {
            return compare
        }
    })

    symptoms.forEach(
        ({ id, name, terms }) => writeStream.write(`"${id}","${name}",${terms.length > 0 ? terms.join(",") : ""}\n`),
    )
}

export default getBodyRegions
