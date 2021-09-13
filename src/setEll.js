function setEllItem(dom) {
  const {innerText, clientWidth} = dom
  const {left, top} = dom.getClientRects()[0]
  dom.setAttribute('ell-value', innerText)
  dom.classList.add('has-ell')
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
  let cssTextArr = dom.style.cssText.split(';')
  let cssObj = {}
  cssTextArr.forEach((item) => {
    let arr = item.split(':')
    cssObj[arr[0]] = arr[1]
  })
  cssObj['--ell-left'] = `${left}px`
  cssObj['--ell-top'] = `${top - afterDomOffsetHeight - 5}px`
  cssObj['--ell-angle-left'] = `${left + clientWidth / 2 - 2.5}px`
  cssObj['--ell-angle-top'] = `${top - 5}px`
  let cssTestString = ''
  for (let key in cssObj) {
    cssTestString += key + ':' + cssObj[key] + ';'
  }
  dom.style.cssText = cssTestString
}

export default function setEll() {
  document.querySelectorAll('.ell').forEach((dom) => {
    if (dom.classList.contains('ell') && dom.scrollWidth > dom.clientWidth) {
      setEllItem(dom)
    }
  })
}
