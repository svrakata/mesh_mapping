const isPermutation = (phrase, variation) => {
    const termWords = phrase.split(" ")
    const variationWords = variation.split(" ")

    if (termWords.length === 1 || variationWords.length === 1 || phrase === variation) {
        return false
    }

    return termWords.length === variationWords.length && termWords.every((word) => variationWords.includes(word))
}

export default isPermutation
