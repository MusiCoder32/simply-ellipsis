import setEll from "./src/setEll.js";
import setObserver from "./src/setObserver.js";
import debounce from "./src/debounce.js";

export default function startEllipsis(id) {
  const setEllDebounce = debounce(setEll,1000)
  window.onresize = setEllDebounce
  // window.onscroll = function () {
  //   console.log('onscroll')
  //   setEllDebounce()
  // }
  window.onload = function () {
      setEll()
      setObserver(id)
  }
}
