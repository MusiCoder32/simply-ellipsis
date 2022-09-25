export default function debounce(fn, t) {
    let delay = t || 500
    let pre = Date.now()
    return function () {
        let args = arguments
        let now = Date.now()
        if (now - pre >= delay) {
            fn.apply(this, args)
            pre = Date.now()
        }
    }
}
