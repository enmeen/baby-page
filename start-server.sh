#!/bin/bash

# start-server.sh - 启动本地web服务器脚本

# 脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 默认端口
DEFAULT_PORT=8000

# 获取端口参数，如果没有提供则使用默认端口
PORT=${1:-$DEFAULT_PORT}

echo "🚀 正在启动本地web服务器..."
echo "📁 目录: $SCRIPT_DIR"
echo "🌐 端口: $PORT"
echo "🔗 访问地址: http://localhost:$PORT"
echo ""

# 检查端口是否被占用
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ 端口 $PORT 已被占用，正在尝试寻找可用端口..."
    
    # 寻找可用端口
    for ((port=$PORT; port<=9000; port++)); do
        if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
            PORT=$port
            echo "✅ 找到可用端口: $PORT"
            break
        fi
    done
fi

echo "📖 使用说明:"
echo "   - 在浏览器中打开: http://localhost:$PORT"
echo "   - 按 Ctrl+C 停止服务器"
echo ""

# 切换到脚本所在目录
cd "$SCRIPT_DIR"

# 优先使用 Python 3，如果不存在则使用 Python
if command -v python3 >/dev/null 2>&1; then
    echo "🐍 使用 Python 3 启动服务器..."
    python3 -m http.server $PORT
elif command -v python >/dev/null 2>&1; then
    echo "🐍 使用 Python 启动服务器..."
    python -m SimpleHTTPServer $PORT
else
    echo "❌ 错误: 未找到 Python"
    echo "请安装 Python 或使用其他方式启动服务器"
    exit 1
fi
