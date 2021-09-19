import setEll from "./src/setEll.js";
import setObserver from "./src/setObserver.js";

export default function startEllipsis(id) {
  setEll()
  window.onresize = function () {
    setEll()
  }
  window.onload = function () {
    setObserver(id)
  }
}
