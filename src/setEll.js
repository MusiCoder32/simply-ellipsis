import getClientSize from './getClientSize.js'

function setEllItem(dom, type) {
  // 获取dom的尺寸
  const {innerText, clientWidth} = dom
  const {w, h} = getClientSize()//浏览器可见区域高宽尺寸
  window.dom = dom
  const {left, top, bottom, right} = dom.getClientRects()[0]

  dom.setAttribute('ell-value', innerText)
  dom.classList.add('has-ell')
  //获取ell:after的尺寸
  const afterDom = window.getComputedStyle(dom, 'after')
  var {paddingBottom, paddingLeft, paddingRight, paddingTop, height, width} = afterDom
  let obj = {
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    height,
    width,
  }
  for (let key in obj) {
    obj[key] = parseInt(obj[key])
  }
  var {paddingBottom, paddingLeft, paddingRight, paddingTop, height, width} = obj
  const afterDomOffsetWidth = width + paddingLeft + paddingRight
  const afterDomOffsetHeight = height + paddingTop + paddingBottom

  //获取ell:before，即气泡框上的小三角的尺寸
  const beforeDom = window.getComputedStyle(dom, 'before')
  const borderWidth = parseInt(beforeDom.borderWidth)

  // 根据上一步获取的尺寸，计算ell堤示框能否在视野内完全显示，若不能，强制更换其显示位置
  if (left - afterDomOffsetWidth - borderWidth < 0 && type === 'left') type = 'right'
  if (right + afterDomOffsetWidth + borderWidth > h && type === 'right') type = 'left'
  if (top - afterDomOffsetHeight - borderWidth < 0 && type === 'top') type = 'bottom'
  if (bottom + afterDomOffsetHeight + borderWidth > h && type === 'bottom') type = 'top'

  // 根据实际的ell提示框位置来设置气泡框小三角的朝向
  dom.classList.add('has-ell-' + type)


  // 获取目标dom的style并封装成对象，便于修改
  let cssTextArr = dom.style.cssText.split(';')
  let cssObj = {}
  cssTextArr.forEach((item) => {
    let arr = item.split(':')
    cssObj[arr[0]] = arr[1]
  })

  //根据ell位置，给style对象设置新值
  let ellLeft = 0
  switch (type) {
    case 'top':
      ellLeft = left - (afterDomOffsetWidth - clientWidth) / 2
      ellLeft = Math.max(ellLeft, 10)
      ellLeft = Math.min(ellLeft,w-afterDomOffsetWidth-10)
      cssObj['--ell-left'] = `${ellLeft}px`
      cssObj['--ell-top'] = `${top - afterDomOffsetHeight - borderWidth}px`
      cssObj['--ell-angle-left'] = `${left + clientWidth / 2 - 2.5}px`
      cssObj['--ell-angle-top'] = `${top - borderWidth}px`
      break;
    case 'bottom':
      ellLeft = left - (afterDomOffsetWidth - clientWidth) / 2
      ellLeft = Math.max(ellLeft, 10)
      ellLeft = Math.min(ellLeft,w-afterDomOffsetWidth-10)
      cssObj['--ell-left'] = `${ellLeft}px`
      cssObj['--ell-top'] = `${bottom + borderWidth}px`
      cssObj['--ell-angle-left'] = `${left + clientWidth / 2 - 2.5}px`
      cssObj['--ell-angle-top'] = `${bottom - borderWidth}px`
      break;
    case 'left':
      cssObj['--ell-left'] = `${right + borderWidth}px`
      cssObj['--ell-top'] = `${top - afterDomOffsetHeight - borderWidth}px`
      cssObj['--ell-angle-left'] = `${left + clientWidth / 2 - 2.5}px`
      cssObj['--ell-angle-top'] = `${top - borderWidth}px`
      break;
      case 'right':
      cssObj['--ell-left'] = `${right + borderWidth}px`
      cssObj['--ell-top'] = `${top - afterDomOffsetHeight - borderWidth}px`
      cssObj['--ell-angle-left'] = `${left + clientWidth / 2 - 2.5}px`
      cssObj['--ell-angle-top'] = `${top - borderWidth}px`
      break;
    default:
      break
  }

  //将新的style对象重新拼接成字符串，返给dom
  let cssTextString = ''
  for (let key in cssObj) {
    cssTextString += key + ':' + cssObj[key] + ';'
  }
  dom.style.cssText = cssTextString
}

export default function setEll() {
  document.querySelectorAll('.ell-l').forEach((dom) => {
    if (dom.scrollWidth > dom.clientWidth) setEllItem(dom, 'left')
  })
  document.querySelectorAll('.ell-r').forEach((dom) => {
    if (dom.scrollWidth > dom.clientWidth) setEllItem(dom, 'right')
  })
  document.querySelectorAll('.ell-t').forEach((dom) => {
    if (dom.scrollWidth > dom.clientWidth) setEllItem(dom, 'top')
  })
  document.querySelectorAll('.ell-b').forEach((dom) => {
    if (dom.scrollWidth > dom.clientWidth) setEllItem(dom, 'bottom')
  })

}
