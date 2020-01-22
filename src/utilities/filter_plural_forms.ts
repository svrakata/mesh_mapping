const filterPluralForms = (terms) => {
    const allWordsFromTerms = []
    terms.forEach((term) => allWordsFromTerms.push(...term.split(" ")))
    const termsWithoutPluralForms = terms.filter((term) => {
        const words = term.split(" ")
        let notPluralForm = true
        for (const word of words) {
            const lastLetter = word[ word.length - 1 ]
            if (lastLetter === "s") {
                const strippedLastLetterWord = word.substring(0, word.length - 1)
                if (allWordsFromTerms.includes(strippedLastLetterWord)) {
                    notPluralForm = false
                    break
                }
            }
        }

        return notPluralForm
    })

    return termsWithoutPluralForms
}

export default filterPluralForms
