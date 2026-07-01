# ☕ Java 入门教程

一个面向初学者的 Java 学习网站，从零开始到企业级开发，涵盖完整的学习路径。

## 学习路径

```
📚 基础入门          ← 从零上手，不需前置知识
├── 变量与数据类型
├── 流程控制
├── 类与对象
├── 异常处理
└── 泛型

📈 进阶提高          ← 掌握核心 API，提升表达能力
├── 集合框架
├── 日期与时间
├── Lambda 与 Stream
├── 多线程与并发
└── 注解 / IO / 反射

🏭 高阶实战          ← 企业级工具与框架实战
├── Maven 构建
├── Spring Boot
├── 数据库访问
├── REST API
├── 单元测试
└── 日志与配置
```

## 特性

- **Java 8 为基础**，新增特性标注版本号（如 `Java 11+`、`Java 14+`、`Java 21+`）
- **17 个页面**，覆盖 Java 核心语法到企业级框架
- **可运行代码示例**，每个知识点附带完整 Java 代码，支持行号显示
- **响应式设计**，桌面和移动端均可流畅浏览
- **交互增强**：阅读进度条、一键复制代码、右侧目录导航、回到顶部、搜索功能、暗色模式
- **教学优化**：每节包含学习目标、常见错误避坑、关键要点总结、动手练习题

## 快速开始

可以直接用浏览器打开 `index.html` 开始学习，无需搭建服务器。

### 本地预览（推荐）

用 VS Code Live Server、Python HTTP 服务器或任意静态文件服务器：

```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .
```

然后访问 `http://localhost:8080`。

### 环境要求

学习本教程需要安装 JDK 8+：

- [JDK 8](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html)（教程基础版本）
- [JDK 17+](https://jdk.java.net/)（体验新特性）

## 项目结构

```
java-learning/
├── index.html              # 首页 — 学习路径导航
├── css/
│   └── style.css           # 全局样式（665 行）
├── js/
│   └── main.js             # 交互逻辑（进度条、复制、目录等）
└── pages/
    ├── basics.html         # 变量与数据类型
    ├── control-flow.html   # 流程控制
    ├── oop.html            # 类与对象
    ├── exceptions.html     # 异常处理
    ├── generics.html       # 泛型
    ├── collections.html    # 集合框架
    ├── datetime.html       # 日期与时间
    ├── streams.html        # Lambda 与 Stream
    ├── concurrency.html    # 多线程与并发
    ├── advanced.html       # 注解 / IO / 反射
    ├── maven.html          # Maven 构建
    ├── springboot.html     # Spring Boot
    ├── database.html       # 数据库访问
    ├── restapi.html        # REST API
    ├── testing.html        # 单元测试
    └── logging.html        # 日志与配置
```

## 浏览提示

- 💡 按左侧 **学习路径顺序** 阅读效果更佳
- 📋 代码块右上角 **一键复制**，方便本地运行
- 📖 右侧 **目录导航** 快速跳转到当前页的章节
- 🔝 滚动超过 300px 后右下角出现 **回到顶部** 按钮
- 📱 移动端左侧菜单自动隐藏，点击 ☰ 展开
