// give the branch and return every child on that branch
// this wont work if the property is an array --> should think how to do it, not enough time right now

const getNestedObjectValues = (obj: object, searchProp: string = null) => {

    const values = []

    const getValues = (ob) => {

        if (ob.hasOwnProperty(searchProp)) {
            values.push(ob[ searchProp ])
        }

        for (const prop in ob) {
            if (typeof ob[ prop ] === "object") {
                getValues(ob[ prop ])
            } else {
                if (searchProp === null) {
                    values.push(ob[ prop ])
                }
            }
        }
    }

    getValues(obj)

    return values
}

export default getNestedObjectValues
