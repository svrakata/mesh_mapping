const sanitizeString = (str: string): string => {
    return str.toLowerCase().replace(/[^a-z0-9\- ]/gmi, "").replace(/\s\s+/g, " ").trim()
}

export default sanitizeString
