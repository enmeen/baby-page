# Look, Say, Cover, Write, Check - 英语单词练习表

一个用于英语单词练习的可打印工作表生成器。采用经典的"看、说、遮、写、检"学习方法。

## 功能特点

- 📝 英语单词练习表格生成
- 🖨️ 优化的A4打印布局
- ✅ 带复选框的检查功能
- 🎨 交替行背景便于阅读
- 📱 响应式设计支持移动设备
- 🏗️ 模块化ES6架构

## 使用方法

### 快速开始

1. 克隆项目到本地
2. 运行本地服务器：
   ```bash
   ./start-server.sh
   ```
3. 在浏览器中打开 `http://localhost:8000`
4. 点击浏览器的打印功能进行打印

### 文件结构

```
baby-page/
├── data/
│   └── vocabulary.js      # 词汇数据
├── index.html            # 主页面
├── start-server.sh       # 服务器启动脚本
├── .gitignore           # Git忽略文件
└── README.md            # 项目说明
```

### 自定义词汇

编辑 `data/vocabulary.js` 文件来添加或修改词汇：

```javascript
export const vocabulary = [
    { english: 'word', chinese: '单词' },
    // 添加更多词汇...
];
```

## 学习方法

1. **Look (看)**: 学生查看英文单词和中文释义
2. **Say (说)**: 大声朗读英文单词
3. **Cover (遮)**: 遮住英文单词
4. **Write (写)**: 在练习框中书写单词（3次练习机会）
5. **Check (检)**: 检查书写是否正确，在复选框中打勾

## 技术特点

- 纯前端实现，无需后端服务器
- ES6模块化设计
- CSS Grid和Flexbox布局
- 优化的打印样式
- 跨浏览器兼容

## 系统要求

- 现代浏览器（支持ES6模块）
- Python 3（用于本地开发服务器）

## 开发

如需修改项目，请：

1. 编辑相应文件
2. 使用 `./start-server.sh` 启动本地服务器测试
3. 在浏览器中查看效果

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。
