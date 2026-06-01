# 事件记录系统 - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 建立事件记录文件夹（08_事件记录）
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在 ZERO 根目录创建 `08_事件记录` 文件夹
  - 将原来的 `08_复盘系统` 重命名或移到合适位置
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `human-judgement` TR-1.1: 检查 `08_事件记录` 文件夹是否存在
- **Notes**: 注意原复盘系统的文件处理

## [x] Task 2: 创建事件索引文件模板
- **Priority**: P0
- **Depends On**: [Task 1]
- **Description**: 
  - 在 `08_事件记录` 中创建 `事件目录.md`
  - 定义索引文件格式（时间倒序、事件简介、链接）
- **Acceptance Criteria Addressed**: [AC-2]
- **Test Requirements**:
  - `human-judgement` TR-2.1: 检查 `事件目录.md` 文件是否存在且格式正确
- **Notes**: 设计清晰的索引格式，包含日期、序号、事件名称、链接、关键词

## [x] Task 3: 创建第一个事件文件夹（001_2026-06-01）
- **Priority**: P0
- **Depends On**: [Task 2]
- **Description**: 
  - 在 `08_事件记录` 中创建 `001_2026-06-01` 文件夹
  - 在事件文件夹中创建 `记录.md` 文件
- **Acceptance Criteria Addressed**: [AC-3]
- **Test Requirements**:
  - `human-judgement` TR-3.1: 检查事件文件夹和记录文件是否存在
- **Notes**: 第一个事件记录的是对象法学自考考公的讨论

## [x] Task 4: 移动相关文件到事件文件夹
- **Priority**: P0
- **Depends On**: [Task 3]
- **Description**: 
  - 将 `07_沙盒推演/法学自考考公全方案.md` 移动到事件文件夹
  - 可以在事件文件夹中创建总结文件
- **Acceptance Criteria Addressed**: [AC-4]
- **Test Requirements**:
  - `human-judgement` TR-4.1: 检查相关文件是否已移动到事件文件夹中
- **Notes**: 保留原文件位置的引用或移动后更新链接

## [x] Task 5: 更新事件索引
- **Priority**: P0
- **Depends On**: [Task 4]
- **Description**: 
  - 在 `事件目录.md` 中添加第一个事件的记录
  - 确保按时间倒序排列
- **Acceptance Criteria Addressed**: [AC-5]
- **Test Requirements**:
  - `human-judgement` TR-5.1: 检查索引文件是否包含第一个事件记录
- **Notes**: 添加关键词以便未来搜索（如：法学、自考、考公、对象、川农大）
