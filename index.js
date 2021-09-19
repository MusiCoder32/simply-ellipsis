import setEll from "./src/setEll.js";
import setObserver from "./src/setObserver.js";

export default function startEllipsis(id) {
  window.onresize = function () {
    setEll()
  }
  window.onload = function () {
      setEll()
      setObserver(id)
  }
}
