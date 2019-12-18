const findTreeBranchValue = (path: string[], map: object) => {
    let value: any = map
    path.forEach((prop) => {
        if (value.hasOwnProperty(prop)) {
            value = value[ prop ]
        } else {
            throw new Error(`The property "${prop}" doesn't exist on this path`)
        }
    })

    return value
}

export default findTreeBranchValue
