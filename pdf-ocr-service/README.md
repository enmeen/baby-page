# PDF OCR 服务

这是一个基于Node.js的PDF OCR服务，用于从PDF文件中提取文本内容并解析词汇表数据。

## 功能特性

- ✅ 提取PDF文件的文本内容
- ✅ 智能解析词汇表格式（英文-音标-中文）
- ✅ 自动生成vocabulary.js文件
- ✅ 支持本地文件和上传文件
- ✅ RESTful API接口
- ✅ 错误处理和日志记录

## 快速开始

### 1. 安装依赖

```bash
cd pdf-ocr-service
pnpm install
```

### 2. 启动服务

```bash
# 方式1：使用启动脚本（推荐）
./start-service.sh

# 方式2：直接运行
pnpm start

# 方式3：开发模式（自动重启）
pnpm run dev
```

服务启动后访问：http://localhost:3001

## API接口

### 1. 健康检查
```
GET /health
```

### 2. 提取本地PDF文本
```
POST /extract-local
Content-Type: application/json

{
  "filePath": "/path/to/your/file.pdf"
}
```

### 3. 上传并提取PDF文本
```
POST /extract-upload
Content-Type: multipart/form-data

pdf: [PDF文件]
```

### 4. 解析词汇表数据
```
POST /parse-vocabulary
Content-Type: application/json

{
  "filePath": "/path/to/your/file.pdf",
  "text": "可选，如果已有提取的文本"
}
```

### 5. 生成vocabulary.js文件
```
POST /generate-vocabulary-file
Content-Type: application/json

{
  "vocabulary": [
    { "english": "hello", "symbol": "həˈloʊ", "chinese": "你好" }
  ],
  "fileName": "unit1"
}
```

## 使用示例

### 1. 处理Unit1 PDF文件

```bash
# 方式1：使用curl命令
curl -X POST http://localhost:3001/extract-local \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/Users/desen/mine/Personal project/baby-page/PDF/Unit1 音素拆分 带音标-翻译.pdf"}'

# 方式2：解析并生成vocabulary.js
curl -X POST http://localhost:3001/parse-vocabulary \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/Users/desen/mine/Personal project/baby-page/PDF/Unit1 音素拆分 带音标-翻译.pdf"}'
```

### 2. 在项目中使用

```javascript
// 客户端JavaScript示例
async function processUnit1PDF() {
    try {
        // 1. 提取PDF文本
        const extractResponse = await fetch('http://localhost:3001/parse-vocabulary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filePath: '/Users/desen/mine/Personal project/baby-page/PDF/Unit1 音素拆分 带音标-翻译.pdf'
            })
        });
        
        const data = await extractResponse.json();
        
        if (data.success) {
            // 2. 生成vocabulary.js文件
            const generateResponse = await fetch('http://localhost:3001/generate-vocabulary-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vocabulary: data.vocabulary,
                    fileName: 'unit1'
                })
            });
            
            const result = await generateResponse.json();
            console.log('成功生成文件:', result.path);
        }
    } catch (error) {
        console.error('处理失败:', error);
    }
}
```

## 支持的词汇表格式

服务能够智能识别多种词汇表格式：

1. `单词 /音标/ 中文翻译`
2. `单词 音标 中文翻译`
3. `单词	音标	中文翻译` (制表符分隔)
4. `1. 单词 音标 中文翻译`
5. `单词 中文翻译` (无音标)

## 目录结构

```
pdf-ocr-service/
├── server.js           # 主服务文件
├── package.json        # 项目配置
├── start-service.sh    # 启动脚本
├── uploads/           # 上传文件目录
└── README.md          # 说明文档
```

## 依赖包

- `express` - Web框架
- `multer` - 文件上传处理
- `pdf-parse` - PDF文本提取
- `cors` - 跨域支持
- `fs-extra` - 文件系统扩展

## 注意事项

- 服务运行在端口3001，确保端口未被占用
- 上传文件大小限制为10MB
- 生成的vocabulary.js文件会保存到 `../data/` 目录
- 支持中文文件路径和文件名

## 故障排除

### 1. 端口占用
```bash
# 查看3001端口占用情况
lsof -i :3001

# 杀死占用进程
kill -9 [PID]
```

### 2. 依赖安装失败
```bash
# 清除缓存重新安装
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 3. PDF读取失败
- 确保PDF文件未损坏
- 检查文件路径是否正确
- 确保文件有读取权限
