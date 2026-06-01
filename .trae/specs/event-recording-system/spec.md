# 事件记录系统 - Product Requirement Document

## Overview
- **Summary**: 建立一个事件记录系统，用于存储和管理与 AI 讨论的重要事件，每个事件用序号+日期的文件夹命名，并建立索引目录。
- **Purpose**: 解决重要讨论内容散落、难以查找的问题，提供结构化的事件记录和索引管理。
- **Target Users**: 系统用户（主要是 zzy）

## Goals
- 建立事件记录文件夹结构（序号+日期）
- 创建事件索引目录文件
- 实现第一个事件的记录（6-1对象法学自考考公事件）

## Non-Goals (Out of Scope)
- 不建立自动归档系统
- 不建立搜索功能
- 不建立复杂的分类标签系统

## Background & Context
- 用户有多个重要的讨论内容（如这次的对象法学自考考公）
- 目前讨论内容零散在沙盒推演文件夹中
- 需要更结构化的方式存储和管理这些事件

## Functional Requirements
- **FR-1**: 建立事件记录文件夹（08_事件记录）
- **FR-2**: 建立事件索引文件（事件目录.md）
- **FR-3**: 创建第一个事件文件夹（001_2026-06-01）并记录事件
- **FR-4**: 将现有相关文件移动到事件文件夹中

## Non-Functional Requirements
- **NFR-1**: 命名规范清晰易读
- **NFR-2**: 索引文件定期更新
- **NFR-3**: 保持文件结构简洁

## Constraints
- **Technical**: 必须使用 Markdown 格式
- **Business**: 不依赖外部工具，纯本地存储
- **Dependencies**: 无

## Assumptions
- 用户手动记录和更新索引
- 事件文件夹命名规则：序号_日期_事件名称（可选）
- 索引文件按时间倒序排列

## Acceptance Criteria

### AC-1: 建立事件记录文件夹
- **Given**: 当前 ZERO 目录结构
- **When**: 创建事件记录文件夹
- **Then**: 存在 `08_事件记录` 文件夹
- **Verification**: `human-judgment`

### AC-2: 创建事件索引文件
- **Given**: 事件记录文件夹已创建
- **When**: 创建索引文件
- **Then**: 存在 `08_事件记录/事件目录.md` 文件
- **Verification**: `human-judgment`

### AC-3: 创建第一个事件文件夹
- **Given**: 索引文件已创建
- **When**: 创建第一个事件
- **Then**: 存在 `08_事件记录/001_2026-06-01` 文件夹
- **Verification**: `human-judgment`

### AC-4: 移动相关文件到事件文件夹
- **Given**: 事件文件夹已创建
- **When**: 移动文件
- **Then**: 法学自考考公相关文件移动到事件文件夹中
- **Verification**: `human-judgment`

### AC-5: 更新索引文件
- **Given**: 事件已记录
- **When**: 更新索引
- **Then**: 索引文件中包含第一个事件的记录
- **Verification**: `human-judgment`

## Open Questions
- [ ] 事件文件夹是否需要可选的事件名称后缀？
- [ ] 索引文件是否需要更多元信息（如事件类型、参与人员）？
