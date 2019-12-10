const addTreeBranchValue = (path: string[], map, descriptorUI: string) => {
    addValue(path, map, descriptorUI)
}

const addValue = (path, obj, value) => {
    const prop = path.shift()

    if (!obj.hasOwnProperty(prop)) {
        obj[ prop ] = {}
    }

    if (path.length > 0) {
        addValue(path, obj[ prop ], value)
    } else {
        obj[ prop ].descriptorUI = value
    }
}

export default addTreeBranchValue
