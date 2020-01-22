import isPermutation from "./is_permutation"

const removePermutations = (terms) => {
    const rest = terms

    for (const term of terms) {
        rest.forEach((restTerm, i) => {
            const isPerm = isPermutation(term, restTerm)
            if (isPerm) {
                rest.splice(i, 1)
            }
        })
    }

    return rest
}

export default removePermutations
