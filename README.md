# 开发规范
总的原则是遵循现有的代码结构与主要框架进行开发，具体要求如下
1. 前端框架使用vue2.js;
2. ui框架使用ant design vue;
3. 防抖、节流、空值判断等常用方法使用lodash;
4. 时间格式化使用moment;
5. 使用axios发起接口请求;禁止在vue文件中直接使用axios发起请求，必须以方法封装的形式使用，参考src/common/apiRequest.js;
6. 新增非ui框架自带图标时，必须使用svg图标，严格遵循src/icons文件下的使用方式；只需要将svg图标放入src/icons/svg文件夹下,按src/views/index.vue中的方式使用，
7. 使用eslint及prettier统一代码风格，原则不允许修改已配置好的eslint及prettier规则；
8. 禁止在js中进行html拼接;
9. 必须使用scss语言，禁止直接编写css样式;严格参照src/assets/styles下的代码组织方式，main.scss为入口文件，base.scss为高频常用样式，cover.scss为对ui框架样式的覆盖，mixin.scss为样式混入及全局变量定义;
10. .vue文件内超过30行的函数必须在关键位置加注释、.js文件内的函数必须添加函数描述;
11. Prop定义: props的定义至少应指定其类型，无法指定的注释一下;
12. .vue文件内的代码尽量控制在1000行以内;
13. 命名：变量或函数使用小驼峰命名法/常量使用全部字母大写的命名方式/css命名建议采用BEM命名规范;
### antdv主题定制方式
修改src/assets/styles/antd.less中的配置
官网链接https://www.antdv.com/docs/vue/customize-theme-cn/
