# 智渔云项目前端库

[toc]

## “Our Code”理念：
1. 代码是我们的，需要遵循共同的规范；
2. 代码是我写的，却是要给你改的，最终是他的——需要换位思考代码的可读性和可维护性，避免彼此挖坑。

## 开发基本原则
1. 隔离，每个独立的功能抽象为独立的子APP（模块）；
2. 统一，保持模式、功能实现和排版格式的一致性；
3. 简洁，保持模板和样式的简练、减少第三方库的依赖，避免引入复杂；
4. 清晰，保持清晰的树形结构，保持**单向数据流**。

---
## 组件设计

### 原则
1. 将组件设计为“黑盒子”，即纯组件，外部对其使用依赖于确定值。

### 规范
1. 始终使用 kebab-case 的事件名（[原因](https://cn.vuejs.org/v2/guide/components-custom-events.html#事件名)）
2. 超过100行的Vue文件应拆分为独立的js，css，html文件；
3. 事件类型统一添加`on-`前缀，即`this.$emit('on-success', value)`；
4. 事件处理器统一添加`handle`前缀，即`@on-success="handleUpdateNameSuccess"`；

### `v-model` 使用原则
1. 尽量不要使用，`v-model` 的黑魔法是从组件的黑盒子内部对一个值的“突变”，存在不确定性和不可控性；
2. 不确定性是无法确定值的改变是由外部代码操控，还是组件内部触控；
3. 不可控性跟不确定性类似，组件的黑盒子内部可以不受外部控制的改变值，而这个值有可能会对外部的程序产生副作用。

### `v-model` 的合适使用场景
1. 表单型组件（比如`i-input`）的处理，在该场景下，表单组件的`value`是在外部明确期望获取的，而且明确由组件内部输入控制的，是对`onChange`的简写形式（本质上：期待的数据流向是明确的，从内部流向外部）。
2. 组件可完全控制的场景。

    > 一个组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件

### `.sync`和`v-model`的区别
1. 暂时没有想到两者严格的差异🤪；
2. 表面上看只是`$emit 'change'`和`$emit 'update'`的区别（[.sync](https://cn.vuejs.org/v2/guide/components-custom-events.html#sync-修饰符)）。

#### 参考
1. [通过事件向父级组件发送消息](https://cn.vuejs.org/v2/guide/components.html#通过事件向父级组件发送消息)
2. [自定义事件](https://cn.vuejs.org/v2/guide/components-custom-events.html)


---
## 路由设计

### 原则
1. 将路由简化抽象为[RESTful](https://zh.wikipedia.org/wiki/表现层状态转换)的URL，即每一个URL可独立启动对应应用程序的状态和功能；
2. 无状态，刷新浏览器后可完整还原页面的状态和功能，不依赖于之前的页面操作。

### 规范
1. 均通过一个名称来标识一个‘叶子路由’，名称（name）严格使用camelCase格式，遵循module.nested.routeName的命名规范；
2. 路径（path）全小写，和文件的命名格式保持一致，使用kebab-case格式；
3. 路由统一使用描述地址的对象执行跳转，在`:to`和编程两种形式中保持一致。


---
## Store 设计

### 原则
1. 保持单向数据流；
2. 使用namespace 隔离各个功能状态；
3. 从模型属性衍生出的视图模型属性，使用computed（getter）表达。

### 规范
1. strict设置为true；
2. namespace设置为true；
3. 当使用 mapState, mapGetters, mapActions 和 mapMutations 这些函数来绑定带命名空间的模块时，将模块的空间名称字符串作为第一个参数传递给上述函数；


---
## Request

### 原则
使用代理磨平开发、测试和生产环境的差异，直接使用最终的Path发起请求；

---
## Filter

### 原则
定义一套标准来过滤一组对象；

### 规范
1. 脱离业务逻辑而抽象出来的公用的过滤器（例如时间的格式化过滤器），放在common的filter文件夹中并且全局定义过滤器；
2. 在业务模块中，过滤器定义在模块的filter文件中。需要使用过滤器的组件，引用filter文件并在组件中定义本地的过滤器；


---
## 文件及代码命名规范

### 文件夹命名规范

1. 文件夹一律采用全小写中杠分隔的形式，例如 `ecs-seahare` 进行命名。

### 文件命名规范

1. 文件一律采用全小写中杠分隔的形式，例如 `toggle-password.vue` 进行命名

### 代码命名规范

1. 输出和注册组件一律采用大写驼峰形式，例如`LoginTemplate`；
2. 使用组件时一律采用全小写中杠分隔的形式，例如`<login-template></login-template>`；
3. 在书写 html 时，为区分`iview`自定义的标签和`html`原生标签，需要将`iview`标签写成带有`i-`前缀的形式。如：`<i-menu-item></i-menu-item>`；
4. `import`vue文件组件时必须添加`vue`后缀（原因：webpack无法区分同名的.js和.vue文件，两者会产生不确定随机引用，有可能造成文件入口错误）；
5. `import`频道（子App）内文件用相对路径，频道外文件用绝对路径（`'@/common/utils/request'`）；

#### 遗留待考虑问题

1. 项目中js、css以及Vue文件是否需要进行文件夹归属拆分

### 目录结构示意图
![目录结构示意图](./目录结构示意图.png)

---
## API接口

1. 所有的API接口字段信息保持一致；
2. 时间统一以毫秒级别的形式进行传递，前端进行对时间数据的处理；
3. API接口信息中不用的字段不应该传递；
4. API接口字段尽量返回数据库原始数据，保持数据的可复用性以及原始性；


## 常用自定义过滤器

### 1. `dtf`

#### 作用
格式化时间字符串。

#### 使用方法
`dtf`或`dtf('yyyy-MM-dd')`，[API参考](https://moment.github.io/luxon/docs/manual/formatting.html#formatting-with-tokens--strings-for-cthulhu-)。


---
## 常用自定义指令

### 1. `v-timely-validate`

#### 作用
将表单验证规则`rules`中验证的触发时机从`blur`修改为`change`，以及时消除错误。

#### 表单校验原则
1. 尽量不强行阻止用户（比如`text`表单元素中不截断用户的超长度输入，`number`表单元素中不阻止用户输入字符等，及时提醒就好）；
2. 及时提醒用户出错；
3. 不打扰用户正常输入（比如第一次输入用`blur`时机校验）；
4. 尽早消除错误提醒（比如有了出错提醒后用`change`时机校验）；

#### 使用方法
1. 在`i-form`表单组件中添加`v-timely-validate`指令；
2. 在`i-input`等表单元素组件中添加跟`rules`对应的`name`属性；
3. 在`i-form`的`rules`中使用`blur`触发。

---
## QA

### 1. `beforeRouteUpdate`触发问题

#### 原因
不同路由同对一个组件存在复用，如下例所示从路由1进入路由2时，不会触发`beforeRouteUpdate`方法。

#### 解决
1. 让两者路由兼容，使其在同一个路由中匹配，避免上面的场景出现；

#### Todo
有可能在别名路由中也会存在上面的问题，未测试。

#### 其他
1. `beforeRouteUpdate`只能在绑定路由的组件中使用，其他组件中不会响应；

#### 使用发生场景
1. 在列表页有分页以及在当前页需要进行查询搜索条件时，url路由配置时候需要注意

#### 示例代码
```javascript
// 更改前
{
    // 路由1
    path: '',
    component: () => import(/* webpackChunkName: "ecs-seahare" */ './views/index.vue'),
},
{
    // 路由2
    path: ':page(\\d+)/:keyword?',
    component: () => import(/* webpackChunkName: "ecs-seahare" */ './views/index.vue'),
},

// 更改后
{
    // 注意路由之间会相互冲突
    path: ':page(\\d+)/:keyword?',
    component: () => import(/* webpackChunkName: "ecs-seahare" */ './views/index.vue'),
},
```
### 2. 被复用组件状态更新问题

#### 表现
项目中的左侧菜单在部分页面跳转时，没有相应改变当前高亮项目，依旧是前一个页面的高亮状态

#### 原因
`router-view` 内的页面跳转，会复用相同组件，当前菜单高亮方法 `currentHighlight` 在组件内 `created` 周期中调用，因为组件实例复用，组件的生命周期钩子不会再被调用，高亮方法没有执行。

#### 分析尝试
`currentHighlight` 方法在适当时机调用是解决问题的关键，如果在组件的生命周期内调用方法会因为组件的复用而不被执行，因为是路由发生变化，因此尝试在组件内使用导航守卫提供的`beforeRouteEnter` 调用 `currentHighlight` 方法
``` javascript
beforeRouteEnter(to, from, next) {
    next((vm) => {
        vm.currentHighlight();
    });
},
```
但方法依然没有被调用执行，为了验证 `beforeRouteEnter` 可以使用的组件场景，进行了三种情况的测试；

* 在 `router.js` 内引用的组件，**可以使用**
* 在 `router.js` 内引用的组件的子组件，**无法使用！**
* 没有在 `router.js` 内引用的组件，**无法使用！**

因此，只有在 `router.js` 里直接引用的组件实例内可以使用 `beforeRouteEnter`等组件钩子方法，其他组件内都不能使用，菜单组件属于没有被 `router.js` 引用的组件，因此只能采用其他方式调用 `currentHighlight` 方法；


#### 解决
在被复用组件内，使用 `watch` 观察 `$route` 的变化，触发 `currentHighlight` 方法，可以解决
```javascript
watch: {
        $route() {
            this.currentHighlight();
        },
    },
```
参考：[Vue Router官方说明](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#响应路由参数的变化)

### 3. 第三方依赖语法转化配置

#### 原因
IE11 不能运行项目，检查发现是luxon中的报错，不支持`Object.assign`方法。
默认情况下 babel-loader 会忽略所有 node_modules 中的文件。

#### 解决
在 `vue.config.js` 中配置 `transpileDependencies` 选项，列出来需要转换的第三方库，为该依赖通过 Babel 显式开启语法转换和根据使用情况检测 polyfill。
下面是开启 luxon 的示例。

#### 注意
1. luxon 的 package.json 中配置了`"module": "src/luxon.js"`，在项目编译中使用的是`"build": "vue-cli-service build --modern"`，需要同时配置`mainFields: ['module', 'main']`，让 `import` 在不同模式下引用正确的文件， 这两个选项需要同时配置，否则会报错（该报错原因尚未确认）；
2. axios 用上面的方式不行，会产生报错（该报错原因尚未确认）。

#### 实例代码
```javascript
transpileDependencies: [
    'luxon',
],
configureWebpack: {
    resolve: {
        mainFields: ['module', 'main'],
    },
},
```

#### 参考
1. [Cli Polyfill](https://cli.vuejs.org/zh/guide/browser-compatibility.html#polyfill);
2. [resolve.mainFields](https://webpack.js.org/configuration/resolve/#resolve-mainfields);

### 4. 项目中的某类常用的不变的[{key:value}]数据


#### 原因
项目中某些下拉框中的内容，基本不变又经常使用。项目中某些值要应用过滤器转化为相应的文本。

#### 解决
目前存储在localstorage中，下周调研能否存储在indexDB中。

#### 实例代码
storage.js

```javascript
export default {
    getDatasetTypes() {
        return JSON.parse(sessionStorage.getItem('datasetTypes'));
    },
    setDatasetTypes(data) {
        const types = data || [];
        sessionStorage.setItem('datasetTypes', JSON.stringify(types));
    },
};
```
api.js

```javascript
// 获取数据集的类型
    getDatasetTypes() {
        return Promise.resolve([
            { label: '图像', value: 1 },
            { label: 'NLP', value: 2 },
            { label: '语音', value: 4 },
        ]);
    },
```
main.js

```javascript
created() {
      this.fetchInfo().then(([types, formats, privates]) => {
          storage.setDatasetTypes(types);
          storage.setDatasetFormats(formats);
          storage.setDatasetPrivates(privates);
          this.hasInitInfo = true;
      }).catch((err) => {
          this.$Message.warning(utils.getErrorMsg(err));
      });
  }
  fetchInfo() {
      const { menuType } = this.$route.params;
      return Promise.all([datasetAPI.getDatasetTypes(), datasetAPI.getDatasetFormats(), datasetAPI.getDatasetPrivates(menuType)]);
  }
```
dataset.js

```javascript
this.categorys = storage.getDatasetTypes();
```
filter.js

```javascript
typeTransform(value) {
        if (!value) {
            return '';
        }
        let label = '';
        const datasetTypes = storage.getDatasetTypes();
        datasetTypes.forEach((item) => {
            if (item.value === value) {
                ({ label } = item);
            }
        });
        return label;
    }
```

### 4. 项目中的子组件的props的规范写法

#### 原因
无论我们的组件props属性写成数组还是对象，vue都会帮我们把属性值转化为{type: val}的形式。
```javascript
    function normalizeProps (options: Object, vm: ?Component) {
        const props = options.props
        if (!props) return
        const res = {}
        let i, val, name
        if (Array.isArray(props)) {
            i = props.length
            while (i--) {
                val = props[i]
                if (typeof val === 'string') {
                    name = camelize(val)
                    res[name] = { type: null }
                } else if (process.env.NODE_ENV !== 'production') {
                    warn('props must be strings when using array syntax.')
                }
            }
        } else if (isPlainObject(props)) {
            for (const key in props) {
                val = props[key]
                name = camelize(key)
                res[name] = isPlainObject(val)
                    ? val
                    : { type: val }
            }
        } else if (process.env.NODE_ENV !== 'production') {
            warn(
                `Invalid value for option "props": expected an Array or an Object, ` +
                `but got ${toRawType(props)}.`,
                vm
            )
        }
        options.props = res
    }
```

#### 解决方法
将所有子组件的props属性写成如下形式,免去vue内部的转换，并可以校验我们的传值是否正确。
```javascript
    props: {
        [propName]: {
            type: val,
            default: val,
            ...
        }
    }
```

### 5. template中只包含简单的表达式
#### 原因
复杂表达式会让你的模板过重且难以维护。我们应该尽量描述应该出现的是什么，而非如何计算那个值。
```javascript
    {{
        fullName.split(' ').map(function (word) {
        return word[0].toUpperCase() + word.slice(1)
        }).join(' ')
    }}
```
#### 解决方法
尽量写成有语义的计算属性或方法、filter，从而使得代码可以重用
```javascript
    computed: {
        normalizedFullName: function () {
            return this.fullName.split(' ').map(function (word) {
                return word[0].toUpperCase() + word.slice(1)
            }).join(' ')
        }
    }
```

### 6. 项目文件夹层级过多

#### 原因
文件夹的设置习惯于参照产品菜单来创建，菜单出现三级子菜单时，依照现有的文件夹建立方式会出现7级嵌套，不利于维护开发；

#### 解决方法
跳出原有的思维限制，按照具体项目来建立一级文件夹，避免过深的文件夹层级嵌套，这样也有利于路由的配置简化；

通过路径规划设置，让配置更简练，屏蔽请求路径差异

### 5. `number`修饰器和`rules`校验规则设置细节

#### 场景
针对表单验证中需要校验数字区间的场景，即填写的数字需要在`[min, max]`区间。

#### 细节
1. 设置`v-model`的修饰器`number`，将输入直接转化为数字存储到模型变量中；
2. 确保iView的表单校验规则[async-validator](https://github.com/yiminghe/async-validator)中的`type`和模型变量的类型保持一致，即显示声明为`number`、`float`或`integer`类型（默认的数据类型是`string`）；
3. 如果校验规则中使用了`integer`，则进一步约束`v-model`中的`number`是整数，`float`同理；
4. `type`配置和对应的`require`、`min`和`max`联合使用，分别配置。

#### 解决方法
```html
<i-input
    // 添加`number`修饰器
    v-model.number="form.disk"
    placeholder="请输入数据盘大小"
    type="number"
    name="disk"
    required
    min="20"
    max="500"
>
    <span slot="append">GB</span>
</i-input>
```

```javascript
// 分别设置校验规则
disk: [
    {
        required: true,
        type: 'integer',
        message: '需要输入数据盘大小',
        trigger: 'blur',
    },
    {
        type: 'integer',
        min: 20,
        message: '数据盘大小不能小于20',
        trigger: 'blur',
    },
    {
        type: 'integer',
        max: 500,
        message: '数据盘大小不能大于500',
        trigger: 'blur',
    },
],
```

### 7. 模态框双向绑定处理
`v-modal`会在组件内对传入值进行突变。
采用`$emit`方式，通过事件抛给父组件处理，简写为`.sync`。
是否可以替代`v-modal`。

### 路由组件传参
常见路由传参：
```javascript
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}

const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User },
  ]
})
```
组件和路由高度耦合，使用id时必须由通过路由获取。

通过`props`解耦：
```javascript
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}

const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },
  ]
})
```
其它组件也可通过传入id的方式使用`User`组件。

### 5. `$refs`生效时机

#### 结论
经过测试，`$refs`最早在`mounted`中生效。


---
## Nginx配置

```nginx
# 开发机配置
location /console {
    try_files $uri $uri/ /console/index.html;
    alias /home/haoweilai/webapp/console-static/;
    index index.html;
}
location /console-assets/ {
    alias /home/haoweilai/webapp/console-static/console-assets/;
}
```

```nginx
# 测试机配置
location /console {
    try_files $uri $uri/ /console/index.html;
    alias /home/ubuntu/webapp/console-static/;
    index index.html;
}
location /console-assets/ {
    alias /home/ubuntu/webapp/console-static/console-assets/;
}
```


## 模式

### widget模式
widget 模式名字借鉴于 [Web Widget](https://zh.wikipedia.org/wiki/Web_Widget)，与其含义基本相同，表示小部件、小工具、挂件等，包含可在任意地方直接调用并执行的含义。

在一个页面中可以存在多个Vue实例，将独立小组件封装成单独Vue的实例，并提供函数的调用接口，即widget。

需要使用的时候即直接调用，本质上是在DOM种插入新的Vue实例，通过回调或Promise的形式完成数据的传递。

### 解决的问题
在典型的Vue架构中，UI组件的展示是对组件树中某个组件的状态改变（v-if、v-show等），对于跟业务代码执行某个小分叉逻辑有关的独立小组件（比如 Alert、Confirm、Prompt、Tip 等）有些刻板和沉重，在这种情况下，更有利于调用函数等形式会更便于使用。

由于减少组件树中此类组件的占位，也可以优化程序的性能。

### 示例
1. [re-authorize](/zhiyucloud-fe/src/common/widgets/re-authorize.js)；

---
## 项目启动
```
npm install
```

### 开发命令（支持HMR）
```
npm run serve
```

### 编译命令
```
npm run build
```

### Lint命令
```
npm run lint
```

