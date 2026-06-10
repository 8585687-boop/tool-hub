# Project Development Rules

## 项目定位

这是一个 React + Vite 的海外 Developer Tools 工具站。

目标：
构建可扩展的在线工具平台。

未来支持：
50-100 个工具页面。

---

# 核心开发原则

## 1. 保持现有项目结构

不要随意修改文件结构。

禁止：

- 随意移动文件
- 删除已有目录
- 创建大量无意义目录
- 破坏当前组件关系


新增文件必须放到正确目录。


当前结构：

src/

components/
公共组件


pages/
页面


tools/
工具核心逻辑


utils/
公共工具方法


data/
配置数据



如果已有目录可以使用：

优先复用。

不要重新创建。


---

# 2. 避免重复代码


开发任何新功能前：

先检查已有代码。


如果逻辑已经存在：

必须复用。


例如：

已有：

ToolWorkspace

Toolbar

CopyButton

ErrorCard


新工具：

禁止重新写。


必须使用已有组件。


---

# 3. 公共方法优先


多个工具使用的逻辑：

必须抽取到：

src/utils/


例如：

输入处理：

inputUtils.js


复制：

copyUtils.js


格式处理：

formatUtils.js



不要：

每个工具写：

copyText()

validateInput()

handleError()



---

# 4. 工具逻辑和页面分离


页面：

src/pages/


只负责：

- UI
- 状态
- 调用工具


核心计算：

src/tools/


例如：

JSON：

tools/json/


Base64：

tools/encoding/


Security：

tools/security/


禁止：

把大量算法写在 JSX。


---

# 5. 统一函数返回格式


所有工具函数：

成功：

{
 success:true,
 result:""
}


失败：

{
 success:false,
 error:""
}



禁止：

不同工具返回不同格式。



---

# 6. index.css规范


index.css 是全局样式。


禁止：

里面堆页面专属样式。


全局：

允许：

- CSS变量
- reset
- typography
- 通用按钮
- 通用卡片
- 通用布局


例如：


:root {

--primary-color

--bg-color

--border-color

}


---

页面特殊样式：

不要写入 index.css。


使用：

组件内部 CSS

或者独立 css 文件。



---

# 7. CSS规范


禁止：

大量重复：

margin

padding

border-radius


优先使用变量。


例如：

统一：

border-radius:

var(--radius)


颜色：

使用：

var(--color)


保持：

设计统一。



---

# 8. UI规则


保持 Developer Tools 风格。


特点：

- 简洁
- 专业
- 工具感


参考：

VS Code

GitHub

Linear


不要：

随意改变整体视觉。


---

# 9. 新增工具流程


新增工具：

必须：

1.

创建工具逻辑：

src/tools/


2.

创建页面：

src/pages/


3.

加入：

data/tools.js
将新的页面加入到src\data\tools.js里面


4.

复用：

ToolWorkspace



---

# 10. 修改代码前


先检查：

是否已有类似实现。


优先：

修改已有方法。


不要：

复制一份新的。



---

# 11. 删除代码规则


删除前确认：

- 是否被引用
- 是否公共组件
- 是否其他工具依赖


不要为了简洁破坏结构。


---

# 12. 测试要求


新增工具必须测试：

正常输入

错误输入

空输入

边界情况



保持已有工具正常。


---

最终目标：

代码：

可维护

可扩展

低重复

结构清晰。