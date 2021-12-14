import getClientSize from './getClientSize.js'

const ellArr = [
    { class: '.ell-l', type: 'left' },
    { class: '.ell-r', type: 'right' },
    { class: '.ell-t', type: 'top' },
    { class: '.ell-b', type: 'bottom' },
]
const ellnArr = [
    { class: '.elln-l', type: 'left' },
    { class: '.elln-r', type: 'right' },
    { class: '.elln-t', type: 'top' },
    { class: '.elln-b', type: 'bottom' },
]
function setEllItem(dom, type) {
    const padding = 5 //定义弹框距边界的位置
    const anglePadding = 9 //定义小三角距边界的位置，padding加上圆角尺寸
    // 获取dom的尺寸
    const { innerText, clientWidth, clientHeight } = dom
    const { w, h } = getClientSize() //浏览器可见区域高宽尺寸
    const { left, top, bottom, right } = dom.getClientRects()[0]
    dom.setAttribute('ell-value', innerText)

    // 获取目标dom的style并封装成对象，便于修改
    let cssTextArr = dom.style.cssText.split(';')
    let cssObj = {}
    cssTextArr.forEach((item) => {
        let arr = item.split(':')
        cssObj[arr[0]] = arr[1]
    })

    //获取ell:after的尺寸
    let afterDom = window.getComputedStyle(dom, 'after')
    let afterWidth = parseInt(afterDom.width)
    let afterMaxWidth = parseInt(afterDom.maxWidth)
    if (afterWidth >= afterMaxWidth) {
        cssObj['--ell-wrap'] = 'pre-wrap'
        cssObj['--ell-min-width'] = afterDom.maxWidth
        cssObj['--ell-width'] = afterDom.maxWidth
    } else {
        cssObj['--ell-wrap'] = 'nowrap'
        cssObj['--ell-width'] = afterDom.width
    }
    let cssString = ''
    for (let key in cssObj) {
        cssString += key + ':' + cssObj[key] + ';'
    }
    dom.style.cssText = cssString
    // return
    afterDom = window.getComputedStyle(dom, 'after')
    var { paddingBottom, paddingLeft, paddingRight, paddingTop, height, width, maxWidth } = afterDom
    let obj = {
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,
        height,
        width,
        maxWidth,
    }
    for (let key in obj) {
        obj[key] = parseInt(obj[key])
    }
    var { paddingBottom, paddingLeft, paddingRight, paddingTop, height, width, maxWidth } = obj

    const afterDomOffsetWidth = width + paddingLeft + paddingRight
    const afterDomOffsetHeight = height + paddingTop + paddingBottom

    //获取ell:before，即气泡框上的小三角的尺寸
    const beforeDom = window.getComputedStyle(dom, 'before')
    const borderWidth = parseInt(beforeDom.borderWidth)

    // 根据上一步获取的尺寸，计算ell堤示框能否在视野内完全显示，若不能，强制更换其显示位置
    if (left - afterDomOffsetWidth - borderWidth < 0 && type === 'left') type = 'right'
    if (right + afterDomOffsetWidth + borderWidth > w && type === 'right') type = 'left'
    if (top - afterDomOffsetHeight - borderWidth < 0 && type === 'top') type = 'bottom'
    if (bottom + afterDomOffsetHeight + borderWidth > h && type === 'bottom') type = 'top'

    //根据ell位置，给style对象设置新值
    let ellLeft = padding
    let ellTop = padding
    let angleTop = anglePadding
    switch (type) {
        case 'top':
            ellLeft = left - (afterDomOffsetWidth - clientWidth) / 2
            ellLeft = Math.max(ellLeft, padding)
            ellLeft = Math.min(ellLeft, w - afterDomOffsetWidth - padding)
            cssObj['--ell-left'] = `${ellLeft}px`
            cssObj['--ell-top'] = `${top - afterDomOffsetHeight - borderWidth}px`
            cssObj['--ell-angle-left'] = `${left + clientWidth / 2 - borderWidth / 2}px`
            cssObj['--ell-angle-top'] = `${top - borderWidth}px`
            break
        case 'bottom':
            ellLeft = left - (afterDomOffsetWidth - clientWidth) / 2
            ellLeft = Math.max(ellLeft, padding)
            ellLeft = Math.min(ellLeft, w - afterDomOffsetWidth - padding)
            cssObj['--ell-left'] = `${ellLeft}px`
            cssObj['--ell-top'] = `${bottom + borderWidth}px`
            cssObj['--ell-angle-left'] = `${left + clientWidth / 2 - 2.5}px`
            cssObj['--ell-angle-top'] = `${bottom - borderWidth}px`
            break
        case 'right':
            ellTop = top - (afterDomOffsetHeight - clientHeight) / 2
            ellTop = Math.max(ellTop, padding)
            ellTop = Math.min(ellTop, h - afterDomOffsetHeight - padding)

            angleTop = top + (clientHeight - borderWidth) / 2
            angleTop = Math.max(angleTop, anglePadding)
            angleTop = Math.min(angleTop, h - borderWidth * 2 - anglePadding)

            cssObj['--ell-left'] = `${right + borderWidth}px`
            cssObj['--ell-top'] = `${ellTop}px`
            cssObj['--ell-angle-left'] = `${right - borderWidth}px`
            cssObj['--ell-angle-top'] = `${angleTop}px`

            break
        case 'left':
            ellTop = top - (afterDomOffsetHeight - clientHeight) / 2
            ellTop = Math.max(ellTop, padding)
            ellTop = Math.min(ellTop, h - afterDomOffsetHeight - padding)

            angleTop = top + (clientHeight - borderWidth) / 2
            angleTop = Math.max(angleTop, anglePadding)
            angleTop = Math.min(angleTop, h - borderWidth * 2 - anglePadding)

            cssObj['--ell-left'] = `${left - afterDomOffsetWidth - borderWidth}px`
            cssObj['--ell-top'] = `${ellTop}px`
            cssObj['--ell-angle-left'] = `${left - borderWidth}px`
            cssObj['--ell-angle-top'] = `${angleTop}px`
            break
        default:
            break
    }

    //将新的style对象重新拼接成字符串
    let cssTextString = ''
    for (let key in cssObj) {
        cssTextString += key + ':' + cssObj[key] + ';'
    }
    let tooltip = document.getElementById('simply-ellipsis-tooltip')
    if (!tooltip) {
        tooltip = document.createElement('div')
        tooltip.setAttribute('id', 'simply-ellipsis-tooltip')
        document.body.append(tooltip)
    }
    tooltip.setAttribute('ell-value', innerText)
    tooltip.style.cssText = cssTextString
    // 根据实际的ell提示框位置来设置气泡框小三角的朝向
    ellArr.forEach((item) => {
        tooltip.classList.remove('has-ell-' + item.type)
    })
    tooltip.classList.add('has-ell-' + type)
    tooltip.classList.add('has-ell')
    tooltip.classList.add('has-ell-visibility')
}

export const setEll = function () {
    ellArr.forEach((item) => {
        document.querySelectorAll(item.class).forEach((dom) => {
            if (dom.scrollWidth >= dom.offsetWidth) {
                setEllAction(dom,item.type)
            }
        })
    })
    ellnArr.forEach((item) => {
        document.querySelectorAll(item.class).forEach((dom) => {
            if (dom.scrollHeight > dom.offsetHeight) {
                setEllAction(dom,item.type)
            }
        })
    })
}

function setEllAction(dom,type) {
    // 获取浏览器信息，并转小写
    let userAgent = navigator.userAgent.toLowerCase()
    // 用 test 匹配浏览器信息
    if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(userAgent)) {
        dom.ontouchstart = (e) => {
            e.preventDefault()
            setEllItem(dom, type)
        }
        dom.ontouchend = (e) => {
            e.preventDefault()
            let tooltip = document.getElementById('simply-ellipsis-tooltip')
            if (tooltip) {
                tooltip.classList.remove('has-ell-visibility')
            }
        }
        dom.touchcancel = (e) => {
            e.preventDefault()
            let tooltip = document.getElementById('simply-ellipsis-tooltip')
            if (tooltip) {
                tooltip.classList.remove('has-ell-visibility')
            }
        }
    } else {
        dom.onmouseover = () => {
            setEllItem(dom, type)
        }
        dom.onmouseleave = () => {
            let tooltip = document.getElementById('simply-ellipsis-tooltip')
            if (tooltip) {
                tooltip.classList.remove('has-ell-visibility')
            }
        }
    }
}
