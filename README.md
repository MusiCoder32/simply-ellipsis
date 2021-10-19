# 简介
MutationObserver监听dom下所有style变化的方式简化使用，使用节流函数节约性能，在需要设置单行超长省略提示的div中写入class即可，非常方便！

**写入class后，仅当文字内容超长时，才会提示**
### 原生项目集成方式
1. 在head引入example文件夹下的ellipsis.css
2. 引入dist文件夹下的simply-ellipsis.js
3. 调用ellipsis方法，传入id，指定监听的dom

具体可参考包中example中的使用方法

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
### vue2项目集成方式
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
# 使用方式
集成到项目后，只需在需要省略提示的div中使用表格中所列的class即可
注意，class必须直接应用到包裹文字的元素中，目前仅测试了div/span

```html
<div class="ell-t">ellipsis提示</div>
<span class="ell-t">ellipsis提示</span>
```
# 可用class
|class类|效果  |
|--|--|
| ell| 只省略，不提示 |
| ell-t| 顶部提示 |
|ell-b| 底部提示 |
|ell-l| 左侧提示 |
|ell-r| 右侧提示 |

# 使用技巧
1. 可重写.has-ell样式来修改提示框的背景色

```css
.has-ell {
    --ell-background: red !important;
}
```
2. 在v-for形成的滚动列表中，由于父元素的overflow:hidden影响，会导致提示框被遮挡，故可以根据index序号动态设置提示框方向，序号小于2的，设置为ell-b,序号大于2的，设置为ell-t如下

```html
      <div
          :class="index > 2 ? 'ell-t' : 'ell-b'"
          @click="onPolicyClick(item)"
      >
```
