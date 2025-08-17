#!/bin/bash

# PDF OCR 服务启动脚本
echo "🚀 启动PDF OCR服务..."

# 切换到服务目录
cd "$(dirname "$0")"

# 检查pnpm是否安装
if ! command -v pnpm &> /dev/null; then
    echo "❌ 错误：未找到pnpm，正在安装..."
    npm install -g pnpm
    if [ $? -ne 0 ]; then
        echo "❌ pnpm安装失败，请手动安装: npm install -g pnpm"
        exit 1
    fi
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    pnpm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

# 创建必要的目录
mkdir -p uploads
mkdir -p ../data

# 启动服务
echo "✅ 启动PDF OCR服务..."
echo "服务地址: http://localhost:3001"
echo "按 Ctrl+C 停止服务"
echo ""

pnpm start
