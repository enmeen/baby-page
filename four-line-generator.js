/**
 * 四线格单词生成器
 * 使用标准学校练习字体生成四线格英文单词
 */

// 创建四线格单词元素
export function createFourLineWord(word) {
    const container = document.createElement('div');
    container.className = 'four-line-word-container';
    
    // 创建四线格背景
    const linesBackground = document.createElement('div');
    linesBackground.className = 'four-lines-background';
    
    // 创建单词文本
    const wordText = document.createElement('div');
    wordText.className = 'four-line-word-text';
    wordText.textContent = word;
    
    container.appendChild(linesBackground);
    container.appendChild(wordText);
    
    return container;
}

// 获取四线格CSS样式
export function getFourLineStyles() {
    return `
        /* 引入自定义字体 */
        @font-face {
            font-family: 'RileysonRg-Italic';
            src: url('./public/RileysonRg-Italic.ttf') format('truetype');
            font-weight: normal;
            font-style: italic;
            font-display: swap;
        }
        
        /* 四线格容器 */
        .four-line-word-container {
            position: relative;
            width: 100%;
            height: 45px;  /* 进一步减少高度以适应A4页面 */
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;  /* 移除margin以避免额外空间 */
        }
        
        /* 四线格背景 */
        .four-lines-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                /* 顶线 */
                linear-gradient(to right, #ccc 0%, #ccc 100%),
                /* 上中线 */
                linear-gradient(to right, #999 0%, #999 100%),
                /* 基线（下中线）*/
                linear-gradient(to right, #333 0%, #333 100%),
                /* 底线 */
                linear-gradient(to right, #ccc 0%, #ccc 100%);
            background-size: 
                100% 1px,
                100% 1px,
                100% 1px,
                100% 1px;
            background-position: 
                0 2px,   /* 顶线 */
                0 15px,  /* 上中线 */
                0 27px,  /* 基线 */
                0 40px;  /* 底线 */
            background-repeat: no-repeat;
            pointer-events: none;
        }
        
        /* 四线格单词文本 */
        .four-line-word-text {
            position: relative;
            z-index: 1;
            font-family: 'RileysonRg-Italic', 'D Nealian Manuscript', 'Zaner-Bloser', 'Comic Sans MS', 'cursive', monospace;
            font-size: 22px;  /* 稍微增大字体以适应手写字体 */
            font-weight: bold;  /* 设置文字加粗 */
            font-style: italic;
            color: #2c3e50;
            line-height: 1;
            text-align: center;
            letter-spacing: 0.8px;  /* 增加字母间距以适应手写风格 */
            
            /* 确保文字坐在基线上，上升字母能延伸到顶线 */
            position: absolute;
            top: 10px;  /* 向下调整位置使单词更好地对齐基线 */
            left: 0;
            right: 0;
            height: 24px;  /* 稍微增加高度适应手写字体 */
            display: flex;
            align-items: baseline;
            justify-content: center;
            
            /* 字体渲染优化 */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }
        
        /* 打印时的四线格样式优化 */
        @media print {
            .four-line-word-container {
                height: 45px !important;  /* 保持一致的高度 */
                page-break-inside: avoid;
            }
            
            .four-lines-background {
                background-image: 
                    linear-gradient(to right, #666 0%, #666 100%),
                    linear-gradient(to right, #333 0%, #333 100%),
                    linear-gradient(to right, #000 0%, #000 100%),
                    linear-gradient(to right, #666 0%, #666 100%) !important;
                background-position: 
                    0 2px,   /* 顶线 */
                    0 15px,  /* 上中线 */
                    0 27px,  /* 基线 - 加粗 */
                    0 40px !important;  /* 底线 */
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .four-line-word-text {
                color: #000 !important;
                font-family: 'RileysonRg-Italic', 'D Nealian Manuscript', 'Zaner-Bloser', 'Comic Sans MS', 'cursive', monospace !important;
                font-size: 20px !important;  /* 调整打印字体大小 */
                font-weight: bold !important;  /* 打印时保持加粗 */
                font-style: italic !important;
                top: 8px !important;  /* 调整打印时的位置使其对齐基线 */
                height: 24px !important;  /* 调整打印时的高度 */
                letter-spacing: 0.8px !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .four-line-word-container {
                height: 40px;  /* 移动端进一步减少高度 */
            }
            
            .four-lines-background {
                background-position: 
                    0 2px,   /* 顶线 */
                    0 12px,  /* 上中线 */
                    0 22px,  /* 基线 */
                    0 32px;  /* 底线 */
            }
            
            .four-line-word-text {
                font-family: 'RileysonRg-Italic', 'D Nealian Manuscript', 'Zaner-Bloser', 'Comic Sans MS', 'cursive', monospace;
                font-size: 18px;  /* 移动端稍小但仍保持上升字母效果 */
                font-weight: bold;  /* 移动端也保持加粗 */
                font-style: italic;
                letter-spacing: 0.6px;
                top: 7px;  /* 调整移动端位置使其对齐基线 */
                height: 20px;  /* 移动端高度 */
            }
        }
    `;
}

// 初始化四线格样式（将CSS注入到页面）
export function initFourLineStyles() {
    // 检查是否已经添加了样式
    if (document.getElementById('four-line-styles')) {
        return;
    }
    
    const styleElement = document.createElement('style');
    styleElement.id = 'four-line-styles';
    styleElement.textContent = getFourLineStyles();
    document.head.appendChild(styleElement);
}

// 便捷函数：直接生成四线格单词HTML
export function generateFourLineWordHTML(word) {
    return `
        <div class="four-line-word-container">
            <div class="four-lines-background"></div>
            <div class="four-line-word-text">${word}</div>
        </div>
    `;
}
