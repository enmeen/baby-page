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
        /* 四线格容器 */
        .four-line-word-container {
            position: relative;
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 2px 0;
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
                0 5px,   /* 顶线 */
                0 20px,  /* 上中线 */
                0 35px,  /* 基线 */
                0 50px;  /* 底线 */
            background-repeat: no-repeat;
            pointer-events: none;
        }
        
        /* 四线格单词文本 */
        .four-line-word-text {
            position: relative;
            z-index: 1;
            font-family: 'D Nealian Manuscript', 'Zaner-Bloser', 'Comic Sans MS', 'cursive', monospace;
            font-size: 24px;  /* 增大字体以让上升字母超出上中线 */
            font-weight: normal;
            color: #2c3e50;
            line-height: 1;
            text-align: center;
            letter-spacing: 0.5px;
            
            /* 确保文字坐在基线上，上升字母能延伸到顶线 */
            position: absolute;
            top: 12px;  /* 调整位置让上升字母能延伸到顶线区域 */
            left: 0;
            right: 0;
            height: 30px;  /* 增加高度容纳上升字母 */
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
                height: 60px !important;
                page-break-inside: avoid;
            }
            
            .four-lines-background {
                background-image: 
                    linear-gradient(to right, #666 0%, #666 100%),
                    linear-gradient(to right, #333 0%, #333 100%),
                    linear-gradient(to right, #000 0%, #000 100%),
                    linear-gradient(to right, #666 0%, #666 100%) !important;
                background-position: 
                    0 5px,   /* 顶线 */
                    0 20px,  /* 上中线 */
                    0 35px,  /* 基线 - 加粗 */
                    0 50px !important;  /* 底线 */
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .four-line-word-text {
                color: #000 !important;
                font-size: 22px !important;  /* 打印时保持较大字体 */
                font-weight: bold !important;
                top: 10px !important;  /* 调整打印时的位置 */
                height: 32px !important;  /* 增加打印时的高度 */
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .four-line-word-container {
                height: 50px;
            }
            
            .four-lines-background {
                background-position: 
                    0 4px,   /* 顶线 */
                    0 16px,  /* 上中线 */
                    0 28px,  /* 基线 */
                    0 40px;  /* 底线 */
            }
            
            .four-line-word-text {
                font-size: 20px;  /* 移动端稍小但仍保持上升字母效果 */
                top: 10px;  /* 调整移动端位置 */
                height: 25px;  /* 移动端高度 */
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
