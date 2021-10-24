# 简介
**simply-ellipsis是纯原生技术实现的tooltip功能，解决ui组件tooltip功能不够全面的问题**

**在线预览 [https://musicoder32.github.io/](https://musicoder32.github.io/)**

1. 解决tooltip不超长也会提示问题
2. 解决tooltip超出边界时不会自动调整的问题

### 使用方式
框架集成到项目后，只需在需要省略提示的div中使用表格中所列的class即可
注意，class必须直接应用到包裹文字的元素中，目前仅测试了div/span

```html
<div class="ell-t">ellipsis在顶部提示</div>
<span class="ell-b">ellipsis在底部提示</span>
<span class="ell-l">ellipsis在左侧提示</span>
<span class="ell-t">ellipsis在右侧提示</span>
```
### 集成方式

1. 在head引入example文件夹下的ellipsis.css
2. 引入dist文件夹下的simply-ellipsis.js
3. 调用ellipsis方法，传入id，指定监听的dom

具体可参考包中example中的使用方法，理论上react、angler、vue等项目都可以采取该方式，但在实际使用中会有些小问题，后面会详细讲讲vue项目中如何优雅的使用。

```html
<link rel="stylesheet" href="ellipsis.css"/>
<script src="../dist/simply-ellipsis.js"></script>
<script>
	window.addEventListener('load',()=>{
  		ellipsis.setEll()
  		ellipsis.setObserver('app')
	})
</script>
```

### 可用class
|class类|效果  |
|--|--|
| ell| 只省略，不提示 |
| ell-t| 顶部提示 |
| ell-b| 底部提示 |
| ell-l| 左侧提示 |
|ell-r| 右侧提示 |

# 使用技巧
1. 可重写.has-ell样式来修改提示框的背景色

```css
.has-ell {
    --ell-background: red !important;
}
```

## fixed与absolution方案论述
在构思方案时，尝试了两个版本，一个版本采用fixed定位，一个版本采用absolution定位。经过不断探索，最终还是决定使用fixed定位的方式
1. absolution存在的问题

   absolution最大的问题在于，无法绕过祖先元素的overflow:hidden，实际项目中tooltip常常被overflow:hidden所切割，无法全部显示。 其优点在于，不受滚动与transform的影响。

2. fixed存在第一大的问题，一是无法优雅的应用于滚动元素，原因在于元素滚动后，需重新执行setEll计算新的fixed位置，而滚动事件不会向上冒泡，即无法全局设置一次监听解决，需要视情况监听多个滚动事件，在滚动事件结束后执行setEll。
3. fixed存在的第二大问题，祖先元素存在transform样式时,位置计算出现异常，关于这点，可以查看该链接[https://www.zhangxinxu.com/wordpress/2015/05/css3-transform-affect/](https://www.zhangxinxu.com/wordpress/2015/05/css3-transform-affect/)
   解决办法有两个，一个是去除祖先元素的transform属性，一个是获取position分支的代码，采用相对定位。

尽管fixed的问题更多，但不被overflow:hidden影响这个特点更为关键，若后续能出新的css属性，能排除受overflow:hidden影响的子元素，那么absolution会是最完美的解决方案。
仓库中一共有三个分支，一个分支是fixed分支，一个分支是position分支，master分支的代码与fixed分支代码相同


###Api说明
框架暴露了一个ellipsis的对象，该对象提供了两个方法，分别为setEll,setObserver

1. setEll介绍

   该工具的核心方法，调用时会通过document.querySelectorAll方法查找所有应用了"ell-r,ell-l,ell-t,ell-b"Class类的dom元素，进行了以下三个步骤的计算。

        a.计算dom元素文本内容是否超长，若不超长，计算结束，不会出现tooltip提示效果
        b.计算tooltip是否超出对应方向的视图边界，如"ell-b"计算方向为视图底部，若超出视图底部，则将方向改为"ell-t"
        c.根据确定好的方向，计算出tooltip应用fixed定位后的left与top
2. setObserver

   a. 该方法是一个MutationObserver的监听器，通过传入id,获取需要监听的dom,能够监听该dom及其子元素的dom节点删除和添加。

   b. MutationObserver为原生api，只要防止MutationObserver回调函数的频繁执行，则无需担心性能，这点可以采用防抖函数解决，即MutationObserver的回调函数最好使用防抖函数包裹。
   c. setObserver会开启MutationObserver监听，监听事件触发后，会通过防抖的方式调用setEll，防抖时间为1000ms。所以在某些极端情况下，dom处于不断创建删除的情况时，会导致tooltip的位置得到不更新。目前容易遇到的一种情况是，页面存在计时器时。原因在于采用innerHtml或者innerText的方式更新文字内容，实际上在更改text这个Node,会触发MutationObserver，解决方法见疑难解答。

   d.看完上述所有描述，即可明白，重要的是setEll方法,setObserve是可用可不用的。setObserve只配置了观察dom节点变化，无法应对更为复杂的页面变化。在实际项目中，应根据实际情况选择，可以自己配置MutationObserver,也可在页面状态发生改变后，手动调用一次setEll。

### vue2项目集成方式（待更新）
可以采用原生项目使用方式，也可以采用以下方式
1. npm i simply-ellipsis -S
2. 在main.js中引入对应的css

```javascript
import 'simply-ellipsis/example/ellipsis.css'
```
3. App.vue中引入ellipsis

```javascript
import ellipsis from 'simply-ellipsis'
// mounted方法中执行以下两句
     ellipsis.setEll() //单次执行
     // 开启监听，后续vue文件中便不用再执行ellipsis.setEll()方法
     // 若不开启监听，则需要在对应的vue文件执行ellipsis.setEll()方法
     ellipsis.setObserver('app') 
```