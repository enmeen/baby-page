# Look, Say, Cover, Write, Check - 英语单词练习表

一个用于英语单词练习的可打印工作表生成器。采用经典的"看、说、遮、写、检"学习方法。

## 功能特点

- 📝 英语单词练习表格生成
- � 国际音标显示支持
- �🖨️ 优化的A4打印布局
- ✅ 带复选框的检查功能
- 🎨 交替行背景便于阅读
- 📱 响应式设计支持移动设备
- 🏗️ 模块化ES6架构
- 🔗 URL参数动态加载词汇

## 使用方法

### 快速开始

1. 克隆项目到本地
2. 运行本地服务器：
   ```bash
   ./start-server.sh
   ```
3. 在浏览器中打开对应的URL：
   - 默认词汇：`http://localhost:8000`
   - 动物主题：`http://localhost:8000?data=vocabulary1`
   - 食物主题：`http://localhost:8000?data=vocabulary2`
   - 颜色主题：`http://localhost:8000?data=vocabulary3`
4. 点击浏览器的打印功能进行打印

### URL参数说明

支持以下URL参数来定制显示：

#### data 参数 - 指定词汇文件
```
http://localhost:8000?data=词汇文件名
```

例如：
- `?data=vocabulary1` - 加载 `data/vocabulary1.js`
- `?data=vocabulary2` - 加载 `data/vocabulary2.js`
- `?data=vocabulary3` - 加载 `data/vocabulary3.js`
- `?data=utit1` - 加载 `data/utit1.js`

#### noSymbol 参数 - 隐藏音标
```
http://localhost:8000?noSymbol=true
```

当设置为 `true` 时，不显示音标符号，适合初学者或专注于单词拼写的练习。

#### 组合使用
```
http://localhost:8000?data=utit1&noSymbol=true
```

如果不指定参数，默认加载 `data/vocabulary.js` 并显示音标。

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

在 `data/` 目录下创建新的词汇文件，格式如下：

```javascript
// data/vocabulary4.js - 自定义主题词汇
export const vocabulary = [
    { english: 'word1', symbol: 'wɜːrd', chinese: '单词1' },
    { english: 'word2', symbol: 'wɜːrd', chinese: '单词2' },
    // 添加更多词汇...
];
```

字段说明：
- `english`: 英文单词
- `symbol`: 国际音标（可选，如果不提供则不显示音标）
- `chinese`: 中文释义

然后通过URL访问：`http://localhost:8000?data=vocabulary4`

### 现有词汇主题

- `vocabulary` (默认) - 综合词汇
- `vocabulary1` - 动物主题
- `vocabulary2` - 食物主题  
- `vocabulary3` - 颜色主题

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
