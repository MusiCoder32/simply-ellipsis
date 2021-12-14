# 简介
**simply-ellipsis是纯原生技术实现的tooltip功能，解决ui组件tooltip功能不够全面的问题**

**在线预览 [http://sichuan_meiyijia_industry_w327134.gitee.io/ellipsis/](http://sichuan_meiyijia_industry_w327134.gitee.io/ellipsis/)**

1. 解决tooltip不超长也会提示问题
2. 解决tooltip超出边界时不会自动调整的问题（gif最后部分有演示，原本设置tooltip方向为下方出现，当滚动到页面底部时，自动调整为上方出现）
3. 解决多行提示
   ![请添加图片描述](https://img-blog.csdnimg.cn/0ee875fe3e164996a3f804c91d4d2102.gif)
   

### 1.原生集成方式

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

1. 在head引入example文件夹下的ellipsis.css
2. 引入dist文件夹下的simply-ellipsis.js
3. 调用ellipsis方法，传入id，指定监听的dom

   ###### 具体可参考根目录下index.html中的使用方法，react、angler、vue等项目采用全局监听时均采取该方式；
   ###### 若采取手动维护的方式，即不执行setObserver监听的情况下，则需在组件生命周期勾子函数中，代表dom挂载完成的勾子函数中执行setEll方法，对于vue框架,则是在每个组件的mounted勾子函数中执行setEll。

### 2.使用方式
框架集成到项目后，只需在需要省略提示的div中,使用示例中的class。注意事项：
1. class必须直接应用到包裹文字的元素中，目前仅测试了div/span；
2. 元素本身需设置固定宽度；
2. 多行超长省略需设置style="--ell-line:Number"；

```html
<!--单行-->
<div class="ell-t">ellipsis在顶部提示</div>
<span class="ell-b">ellipsis在底部提示</span>
<span class="ell-l">ellipsis在左侧提示</span>
<span class="ell-r">ellipsis在右侧提示</span>
<!--多行-->
<div class="elln-t" style="--ell-line:3">ellipsis多行顶部提示,行数设置为3</div>
<div class="elln-b" style="--ell-line:2">ellipsis多行底部提示,行数设置为2</div>
<div class="elln-l" style="--ell-line:4">ellipsis多行左侧提示,行数设置为4</div>
<div class="elln-r" style="--ell-line:5">ellipsis多行左侧提示,行数设置为5</div>
```

### 3.自定义tooltip样式
1. 可重写html下定义的样式变量来修改tooltip样式，目前只定义了以下变量。

```css
html {
   --ell-max-width: 350px;
   /*重写背景色为红色*/
   --ell-background: red !important;
   --ell-font-size: 12px;
   --ell-padding: 10px;
   --ell-line-height: 1.2;
   --ell-color: #fff;
   --ell-border-radius: 4px;
}
```
### 4.Api说明
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


### 5.版本更新记录
**2.1.0**
1. 向现实妥协，放弃纯css的hover触发tooltip方式，采用dom的mouseover事件触发tooltip,解决上一版本需单独处理scroll与transform的情况;
2. 最初的想法过于极端，一方面表现在希望使用时极简，靠一个class名搞定；二是在触发上也做到极简，不依赖于dom的mouseover监听事件,靠css的hover触发；以至于在实现过程中总是无法完美解决面临的所有情况，有了上面关于《fixed与absolution方案论述》
3. 目前版本单行超长省略提示基本算ok了，下一步目标是实现多行超长省略提示
   
**2.2.0**
1. 实现多行超长省略；
2. 实现自定义tooltip样式；
### 6.疑难解答
1. 问：完全按照教程使用，大部分生效，部分不生效，主要是高德地图与百度地图的信息弹窗中使用不生效？

   ###### 答：全局监听的方式没有监听style的变化，故对于通过style="display:none"来实现dom显隐时，不能自动触发setEll方法执行，在元素display更改后，手动执行一次setEll方法即可生效。
2. 问完全按照教程全局引入方式使用，所有tooltip效果均不生效？
   ###### 答：全局监听使用了防抖节约性能，若页面中存在持续的文本变化，如计时器，秒表，当前时间等随时间不断变化功能，会持续的触发setObserver，导致setEll始终无法执行，tooltip自然无法生效。具体触发原理在Api说明setObserver介绍中。解决方式为放弃框架双向绑定的方式来更新值，采用原生方式更新text节点的值，在线预览中当前时间采取了该方式


```javascript
//dom无初值时先赋初值，具有初值后，会有childNodes,更新时采取如下方式
dom.childNodes[0].data = newValue
```
