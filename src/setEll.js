import getClientSize from './getClientSize.js'

function setEllItem(dom, type) {
  // window.dom = dom
  const padding = 5 //定义弹框距边界的位置
  const anglePadding = 9 //定义小三角距边界的位置，padding加上圆角尺寸
  // 获取dom的尺寸
  let {innerText, clientWidth, offsetHeight} = dom


  //清空dom文字内容，并写入子元素存放之前的文字内容
  let childDom = dom.querySelector('.ell')
  if (!childDom) {
    dom.innerText = ''
    childDom = document.createElement('div')
    childDom.style.width = '100%'
    childDom.style.height = '100%'
    childDom.style.left = '0px'
    childDom.style.top = '0px'
    childDom.innerText = innerText
    childDom.classList.add('ell')
    dom.append(childDom)
    dom.setAttribute('ell-value', innerText)
  }

  const {w, h} = getClientSize()//浏览器可见区域高宽尺寸
  const {left, top, bottom, right} = dom.getClientRects()[0]

  // 获取目标dom的style并封装成对象，便于修改
  let cssTextArr = dom.style.cssText.split(';')
  let cssObj = {}
  cssTextArr.forEach((item) => {
    let arr = item.split(':')
    cssObj[arr[0]] = arr[1]
  })

  //获取ell:after的尺寸
  const afterDom = window.getComputedStyle(dom, 'after')
  // return

  var {paddingBottom, paddingLeft, paddingRight, paddingTop, height, width, maxWidth} = afterDom
  let obj = {
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    height,
    width,
    maxWidth
  }
  for (let key in obj) {
    obj[key] = parseInt(obj[key])
  }
  var {paddingBottom, paddingLeft, paddingRight, paddingTop, height, width, maxWidth} = obj
  if (width >= maxWidth) {
    width = maxWidth
    cssObj['--ell-wrap'] = 'pre-wrap'
    cssObj['--ell-width'] = maxWidth + 'px'
    height = Math.ceil(width/maxWidth)*height
  } else {
    cssObj['--ell-wrap'] = 'nowrap'
    cssObj['--ell-width'] = width + 'px'
  }
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

  // 根据实际的ell提示框位置来设置气泡框小三角的朝向
  dom.classList.add('has-ell-' + type)


  //根据ell位置，给style对象设置新值
  let ellLeft = padding
  let ellTop = padding
  let angleTop = anglePadding
  let angleLeft = anglePadding
  switch (type) {
    case 'top':
      ellLeft = -(afterDomOffsetWidth - clientWidth) / 2
      ellLeft = Math.max(ellLeft, padding - left)
      ellLeft = Math.min(ellLeft, w - afterDomOffsetWidth - padding - left)
      cssObj['--ell-left'] = `${ellLeft}px`
      cssObj['--ell-top'] = `${-afterDomOffsetHeight - borderWidth}px`
      cssObj['--ell-angle-left'] = `${(clientWidth - borderWidth) / 2}px`
      cssObj['--ell-angle-top'] = `${-borderWidth}px`
      break;
    case 'bottom':
      ellLeft = -(afterDomOffsetWidth - clientWidth) / 2
      ellLeft = Math.max(ellLeft, padding)
      ellLeft = Math.min(ellLeft, w - afterDomOffsetWidth - padding - left)
      cssObj['--ell-left'] = `${ellLeft}px`

      cssObj['--ell-top'] = `${offsetHeight + borderWidth}px`
      cssObj['--ell-angle-left'] = `${(clientWidth - borderWidth) / 2}px`
      cssObj['--ell-angle-top'] = `${offsetHeight - borderWidth}px`
      break;
    case 'right':
      ellTop = -(afterDomOffsetHeight - offsetHeight) / 2
      ellTop = Math.max(ellTop, padding - top)
      ellTop = Math.min(ellTop, h - afterDomOffsetHeight - padding - top)

      angleTop = (offsetHeight - borderWidth) / 2
      angleTop = Math.max(angleTop, anglePadding - top)
      angleTop = Math.min(angleTop, h - borderWidth * 2 - anglePadding - top)

      cssObj['--ell-left'] = `${clientWidth + borderWidth}px`
      cssObj['--ell-top'] = `${ellTop}px`
      cssObj['--ell-angle-left'] = `${clientWidth - borderWidth}px`
      cssObj['--ell-angle-top'] = `${angleTop}px`

      break;
    case 'left':
      ellTop = -(afterDomOffsetHeight - offsetHeight) / 2
      ellTop = Math.max(ellTop, padding - top)
      ellTop = Math.min(ellTop, h - afterDomOffsetHeight - padding - top)

      angleTop = (offsetHeight - borderWidth) / 2
      angleTop = Math.max(angleTop, anglePadding - top)
      angleTop = Math.min(angleTop, h - borderWidth * 2 - anglePadding - top)

      cssObj['--ell-left'] = `${-afterDomOffsetWidth - borderWidth}px`
      cssObj['--ell-top'] = `${ellTop}px`
      cssObj['--ell-angle-left'] = `${-borderWidth}px`
      cssObj['--ell-angle-top'] = `${angleTop}px`
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
  dom.classList.add('has-ell')

}

function getStyle(dom, key) {
  return window.getComputedStyle(dom).key
}

export const setEll = function() {
  const ellArr = [
    {class: '.ell-l', type: 'left'},
    {class: '.ell-r', type: 'right'},
    {class: '.ell-t', type: 'top'},
    {class: '.ell-b', type: 'bottom'}
  ]
  ellArr.forEach(item => {
    document.querySelectorAll(item.class).forEach((dom) => {
      // const range = document.createRange();
      // range.setStart(dom, 0);
      // range.setEnd(dom, dom.childNodes.length);
      // const rangeWidth = range.getBoundingClientRect().width;
      // const padding = (parseInt(getStyle(dom, 'paddingLeft'), 10) || 0) +
      //   (parseInt(getStyle(dom, 'paddingRight'), 10) || 0);
      // const domRealWidth = rangeWidth + padding
      const domRealWidth = dom.scrollWidth
      if (domRealWidth > dom.clientWidth) setEllItem(dom, item.type)
    })
  })
}
