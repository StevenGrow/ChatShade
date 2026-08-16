# ChatShade 隐私政策

[English](PRIVACY.md)

ChatShade 采用隐私友好、本地优先的设计。

## ChatShade 不收集什么

ChatShade 不收集个人信息。

ChatShade 不读取、保存、分析、传输或上传用户的 ChatGPT 对话及消息内容。

ChatShade 不跟踪浏览历史。

ChatShade 不使用用户行为统计、遥测、Cookie、远程脚本或网络请求。

## ChatShade 保存什么

ChatShade 仅保存以下主题设置：

- 扩展是否启用。
- 当前选择的预设主题。
- 自定义页面主背景色。
- 自定义对话内容区域背景色。
- 自定义主要文字颜色。

这些设置保存在 Chrome 的扩展存储 `chrome.storage.sync` 中。如果用户的 Chrome 配置文件启用了 Chrome 同步，Chrome 可能会在登录同一配置文件的 Chrome 浏览器之间同步这些设置。

ChatShade 不运营数据服务器，也不会自行将这些设置传输给开发者或第三方。

## ChatShade 在哪里运行

ChatShade 仅在以下页面运行：

```text
https://chatgpt.com/*
```

ChatShade 通过 CSS 变量和本地 CSS 规则修改 ChatGPT 的本地页面样式。它不修改 ChatGPT 的业务逻辑，不拦截网络请求，也不向任何服务器发送数据。

## 第三方扩展声明

ChatShade 是独立开发的第三方浏览器扩展，与 OpenAI 不存在关联，也未获得 OpenAI 的认可或背书。
