# Reasonix 安装指南

> 本指南用于在**新电脑**上安装 Reasonix（DeepSeek 专属的终端 AI 编程助手）。
> 整个安装过程约 5 分钟。

---

## 前置检查

```powershell
node --version
```

需要 **Node.js ≥ 22**。如果没有，先去 [nodejs.org](https://nodejs.org) 下载 LTS 版本安装。

## 安装步骤

### 1. 全局安装

```powershell
npm install -g reasonix
```

验证安装：

```powershell
reasonix --version
```

应看到版本号（当前最新：0.53.x）。

### 2. 获取 API Key

1. 打开 [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)
2. 注册/登录 DeepSeek 账号
3. 创建一个 API Key，复制下来

### 3. 配置 API Key

```powershell
$configDir = "$env:USERPROFILE\.reasonix"
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}
$config = @{ apiKey = "你的key粘贴在这里" }
$config | ConvertTo-Json | Set-Content -Path "$configDir\config.json" -Encoding utf8
```

验证配置：

```powershell
reasonix doctor
```

所有项目绿色通过即可。看到 `9 ok · 0 warn · 0 fail` 说明一切正常。

### 4. 拉取 ZERO 系统

```powershell
git clone https://github.com/zhengrenkai/ZERO.git
cd ZERO
```

### 5. 注入 ZERO 规则 Skill

Reasonix 启动后，在对话中输入：

```
/skill load zero-system
```

或直接在 `.reasonix/skills/` 目录下已经预置了 `zero-system.md` 文件，Reasonix 会自动识别。

### 6. 启动

```powershell
cd ZERO
reasonix code
```

进入后输入 `启动`，AI 将以"零"的身份输出简报。

---

## 费用参考

Reasonix 只对接 DeepSeek 模型，利用前缀缓存机制降低成本：

| 项目 | 参考 |
|------|------|
| 缓存命中率 | 日常可达 99%+ |
| 高强度使用一天 | 约 $12（4.35亿 token） |
| 轻度日常使用 | 几毛到几块 RMB/天 |

充值建议：先充 10-20 元试跑。

---

## 常见问题

**Q: `reasonix doctor` 显示 `api key not set`？**
A: 检查 `~\.reasonix\config.json` 是否创建成功，key 是否粘贴正确。

**Q: `reasonix code` 无法启动 TUI？**
A: 需要在**新的独立 PowerShell/终端**中运行，不能在 AI 聊天面板里跑。

**Q: 想重置配置？**
A: 删除 `~\.reasonix\config.json` 重新配置即可。