// import './src/setStyle.js'
import { setEll } from "./setEll.js";
import debounce from "./debounce.js";

export const  setObserver = function(id) {
  // 观察器的配置（需要观察什么变动）
  const config = {
    attributes: true,
    attributeFilter: ['style'],
    subtree: true,
    childList: true,
  }
  const targetNode = document.getElementById(id)
  // 当观察到变动时执行的回调函数
  const callback = debounce(function (mutationsList, observer) {
    console.log(observer)
    observer.disconnect() //观察到变动后立即销毁
    setEll() //执行操作
    observer.observe(targetNode, config) //操作完成后再开启监听，避免在上一步操作中，循环触发监听
  }, 1000)

// 创建一个观察器实例并传入回调函数
  const observer = new MutationObserver(callback)

// 以上述配置开始观察目标节点
  observer.observe(targetNode, config)
}
