export function timeComparer(time:Date) {
    const now=new Date()
    if (now.getFullYear()!==time.getFullYear()) {
        return false
    }
    if (now.getDate()!==time.getDate()) {
        return false
    }
    return true
}