const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 配置multer存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        fs.ensureDirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // 保持原文件名，添加时间戳避免冲突
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}_${timestamp}${ext}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('只支持PDF文件'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB限制
    }
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'PDF OCR Service is running' });
});

// 从本地PDF文件提取文本
app.post('/extract-local', async (req, res) => {
    try {
        const { filePath } = req.body;
        
        if (!filePath) {
            return res.status(400).json({ error: '请提供文件路径' });
        }

        // 检查文件是否存在
        const fullPath = path.resolve(filePath);
        if (!await fs.pathExists(fullPath)) {
            return res.status(404).json({ error: '文件不存在' });
        }

        // 读取PDF文件
        const dataBuffer = await fs.readFile(fullPath);
        const data = await pdfParse(dataBuffer);

        res.json({
            success: true,
            text: data.text,
            info: {
                pages: data.numpages,
                version: data.version,
                info: data.info,
                metadata: data.metadata
            },
            filePath: fullPath
        });

    } catch (error) {
        console.error('提取本地PDF文本时出错:', error);
        res.status(500).json({ 
            error: '提取文本失败', 
            details: error.message 
        });
    }
});

// 上传并提取PDF文本
app.post('/extract-upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '请上传PDF文件' });
        }

        const filePath = req.file.path;
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdfParse(dataBuffer);

        // 清理上传的文件（可选）
        // await fs.remove(filePath);

        res.json({
            success: true,
            text: data.text,
            info: {
                pages: data.numpages,
                version: data.version,
                info: data.info,
                metadata: data.metadata
            },
            originalName: req.file.originalname,
            savedPath: filePath
        });

    } catch (error) {
        console.error('提取上传PDF文本时出错:', error);
        res.status(500).json({ 
            error: '提取文本失败', 
            details: error.message 
        });
    }
});

// 智能解析词汇表数据
app.post('/parse-vocabulary', async (req, res) => {
    try {
        const { filePath, text } = req.body;
        
        let extractedText = text;
        
        // 如果没有提供文本，从文件中提取
        if (!extractedText && filePath) {
            const fullPath = path.resolve(filePath);
            if (!await fs.pathExists(fullPath)) {
                return res.status(404).json({ error: '文件不存在' });
            }
            
            const dataBuffer = await fs.readFile(fullPath);
            const data = await pdfParse(dataBuffer);
            extractedText = data.text;
        }

        if (!extractedText) {
            return res.status(400).json({ error: '没有可解析的文本内容' });
        }

        // 解析词汇表数据
        const vocabulary = parseVocabularyFromText(extractedText);

        res.json({
            success: true,
            vocabulary: vocabulary,
            totalWords: vocabulary.length,
            rawText: extractedText
        });

    } catch (error) {
        console.error('解析词汇表时出错:', error);
        res.status(500).json({ 
            error: '解析失败', 
            details: error.message 
        });
    }
});

// 解析词汇表文本的函数
function parseVocabularyFromText(text) {
    const vocabulary = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    // 常见的词汇表格式模式
    const patterns = [
        // 格式: "单词 /音标/ 中文翻译"
        /^([a-zA-Z]+)\s*[\/\[\(]([^\/\]\)]+)[\/\]\)]\s*(.+)$/,
        // 格式: "单词 音标 中文翻译"
        /^([a-zA-Z]+)\s+([ˈˌaɪeɪoʊuːɪərɑɔæɛɪŋŋθðʃʒtʃdʒjwɡkpbtdfvszlmnrh\s]+)\s+(.+)$/,
        // 格式: "单词\t音标\t中文翻译"
        /^([a-zA-Z]+)\t+([^t]+)\t+(.+)$/,
        // 格式: "1. 单词 音标 中文翻译"
        /^\d+[\.\)]\s*([a-zA-Z]+)\s+([ˈˌaɪeɪoʊuːɪərɑɔæɛɪŋŋθðʃʒtʃdʒjwɡkpbtdfvszlmnrh\s]+)\s+(.+)$/
    ];
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.length < 3) continue;
        
        let matched = false;
        
        for (const pattern of patterns) {
            const match = trimmedLine.match(pattern);
            if (match) {
                const [, english, symbol, chinese] = match;
                
                // 清理数据
                const cleanEnglish = english.trim().toLowerCase();
                const cleanSymbol = symbol.trim().replace(/[\/\[\]\(\)]/g, '');
                const cleanChinese = chinese.trim().replace(/[；;，,。.！!？?]/g, '');
                
                if (cleanEnglish && cleanChinese) {
                    vocabulary.push({
                        english: cleanEnglish,
                        symbol: cleanSymbol || undefined,
                        chinese: cleanChinese
                    });
                    matched = true;
                    break;
                }
            }
        }
        
        // 如果没有匹配到标准格式，尝试简单的英文-中文匹配
        if (!matched) {
            const simpleMatch = trimmedLine.match(/^([a-zA-Z]+)\s+(.+)$/);
            if (simpleMatch) {
                const [, english, chinese] = simpleMatch;
                const cleanEnglish = english.trim().toLowerCase();
                const cleanChinese = chinese.trim();
                
                if (cleanEnglish && cleanChinese && !/^[a-zA-Z\s]+$/.test(cleanChinese)) {
                    vocabulary.push({
                        english: cleanEnglish,
                        chinese: cleanChinese
                    });
                }
            }
        }
    }
    
    return vocabulary;
}

// 生成vocabulary.js文件
app.post('/generate-vocabulary-file', async (req, res) => {
    try {
        const { vocabulary, fileName = 'unit1' } = req.body;
        
        if (!vocabulary || !Array.isArray(vocabulary)) {
            return res.status(400).json({ error: '请提供有效的词汇表数据' });
        }

        // 生成JavaScript文件内容
        const jsContent = generateVocabularyJS(vocabulary, fileName);
        
        // 保存到项目的data目录
        const outputPath = path.join(__dirname, '..', 'data', `${fileName}.js`);
        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, jsContent, 'utf8');

        res.json({
            success: true,
            message: `成功生成 ${fileName}.js 文件`,
            path: outputPath,
            wordCount: vocabulary.length,
            content: jsContent
        });

    } catch (error) {
        console.error('生成词汇表文件时出错:', error);
        res.status(500).json({ 
            error: '生成文件失败', 
            details: error.message 
        });
    }
});

// 生成vocabulary.js文件内容的函数
function generateVocabularyJS(vocabulary, fileName) {
    const variableName = fileName.replace(/[^a-zA-Z0-9]/g, '');
    
    let content = `// ${fileName}.js - 词汇数据模块\n`;
    content += `export const vocabulary = [\n`;
    
    vocabulary.forEach((word, index) => {
        const englishPart = `english: '${word.english}'`;
        const symbolPart = word.symbol ? `, symbol: '${word.symbol}'` : '';
        const chinesePart = `, chinese: '${word.chinese}'`;
        
        content += `    { ${englishPart}${symbolPart}${chinesePart} }`;
        
        if (index < vocabulary.length - 1) {
            content += ',';
        }
        content += '\n';
    });
    
    content += '];\n';
    
    return content;
}

// 错误处理中间件
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: '文件大小超过限制（最大10MB）' });
        }
    }
    
    res.status(500).json({ error: error.message });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({ error: '接口不存在' });
});

app.listen(PORT, () => {
    console.log(`PDF OCR服务运行在 http://localhost:${PORT}`);
    console.log('可用的接口:');
    console.log('  GET  /health - 健康检查');
    console.log('  POST /extract-local - 提取本地PDF文本');
    console.log('  POST /extract-upload - 上传并提取PDF文本');
    console.log('  POST /parse-vocabulary - 解析词汇表数据');
    console.log('  POST /generate-vocabulary-file - 生成vocabulary.js文件');
});

module.exports = app;
