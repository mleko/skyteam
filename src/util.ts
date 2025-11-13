export function allTrue(booleans: boolean[]): boolean {
    for(const v of booleans){
        if (!v) {
            return false
        }
    }
    return true
}

export function allFalse(booleans: boolean[]): boolean {
    for(const v of booleans){
        if (!!v) {
            return false
        }
    }
    return true
}
