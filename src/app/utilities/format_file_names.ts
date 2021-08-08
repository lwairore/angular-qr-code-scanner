function formatFileNames(str: string): string {
    return str.replace(/[^a-z][a-z]/gi, word => word.toUpperCase().replace(/[^a-z]/gi, ''))
}