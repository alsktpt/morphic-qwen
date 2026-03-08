# UI布局修改计划：模仿Kimi Agent Swarm界面

## TL;DR

> **目标**：将Morphic界面布局调整为类似Kimi Agent Swarm的设计
>
> **修改点**：
>
> 1. 移动Feedback和UserMenu到sidebar底部
> 2. Inspector panel延伸到顶部
> 3. 移除sidebar和inspector的互斥关系
> 4. 增加inspector panel的最大宽度
>
> **涉及文件**：7个核心文件
> **预计工作量**：中等（4个独立任务）
> **移动体验**：保持现有mobile drawer设计不变

---

## Context

### 当前布局结构

```
RootLayout
└── SidebarProvider
    ├── AppSidebar (左侧边栏, collapsible)
    └── div.flex-1
        ├── Header (顶部, 绝对定位)
        │   ├── Feedback按钮
        │   └── UserMenu/GuestMenu
        └── main
            └── ArtifactRoot
                └── ChatArtifactContainer
                    ├── Chat内容区 (flex-1)
                    ├── 调整大小手柄
                    └── InspectorPanel (右侧)
                        └── md:pt-14 (顶部padding)
```

### 目标布局结构 (参考Kimi)

```
RootLayout
└── SidebarProvider
    ├── AppSidebar (左侧边栏)
    │   ├── Header部分 (Logo + Toggle)
    │   ├── Content部分 (New按钮 + 历史记录)
    │   └── Footer部分 ← **Feedback + User/Guest Menu**
    └── div.flex-1
        └── main
            └── ArtifactRoot
                └── ChatArtifactContainer
                    ├── Chat内容区
                    ├── Sidebar (可同时打开) ← **互斥解除**
                    ├── 调整大小手柄
                    └── InspectorPanel (右侧, 全高) ← **延伸到顶部**
                        └── width: 0-1000px ← **更大宽度**
```

### 关键互斥逻辑位置

在 `/components/artifact/artifact-context.tsx` 第72-82行：

```typescript
// Close artifact when sidebar opens
useEffect(() => {
  if (sidebarOpen && state.isOpen) {
    close()
  }
}, [sidebarOpen, state.isOpen, close])

const open = (part: Part) => {
  dispatch({ type: 'OPEN', payload: part })
  setOpen(false) // 打开inspector时关闭sidebar
}
```

---

## Work Objectives

### Core Objective

将Morphic布局调整为类似Kimi Agent Swarm的界面，移动用户控件到sidebar底部，允许sidebar和inspector同时存在，并优化inspector面板尺寸。

### Concrete Deliverables

- [ ] `app-sidebar.tsx` - 底部添加Feedback按钮和User/Guest Menu
- [ ] `header.tsx` - 移除Feedback和UserMenu（仅保留必要元素或简化）
- [ ] `artifact-context.tsx` - 移除互斥逻辑
- [ ] `chat-artifact-container.tsx` - 增加MAX_WIDTH常量
- [ ] `inspector-panel.tsx` - 移除md:pt-14的顶部padding

### Definition of Done

- [ ] Sidebar左下角显示Feedback按钮和用户头像/菜单
- [ ] 打开sidebar时inspector不会自动关闭
- [ ] Inspector panel高度延伸到页面顶部
- [ ] Inspector panel可调整到更宽（1000px+）
- [ ] Mobile体验保持不变（使用drawer）

### Must NOT Have (Guardrails)

- 不修改mobile端的drawer设计（保持原有InspectorDrawer）
- 不修改FeedbackModal的功能逻辑
- 不修改UserMenu和GuestMenu的内部逻辑
- 不修改inspector panel的内容显示逻辑
- 不引入新的依赖包

---

## Execution Strategy

### Wave 1: 基础结构调整 (可并行)

1. **移动Feedback和UserMenu到Sidebar底部** (app-sidebar.tsx)
2. **简化Header组件** (header.tsx) - 移除已移动的组件

### Wave 2: Inspector优化 (可并行)

3. **移除互斥逻辑** (artifact-context.tsx)
4. **增加最大宽度** (chat-artifact-container.tsx)
5. **移除顶部padding** (inspector-panel.tsx)

### Wave 3: 验证 (最终)

6. **综合测试** - 验证所有修改协同工作

---

## TODOs

- [ ] 1. 移动Feedback和User/Guest Menu到Sidebar底部

  **What to do**:
  - 修改 `app-sidebar.tsx`，在SidebarContent后添加SidebarFooter
  - 导入并使用UserMenu和GuestMenu组件
  - 导入并使用FeedbackModal组件
  - 将Feedback按钮和UserMenu/GuestMenu放置在SidebarFooter中
  - 使用flex布局确保底部元素靠底对齐
  - 保持移动端兼容性（mobile时这些组件不应该出现在sidebar）

  **Must NOT do**:
  - 不要删除FeedbackModal的导入，只是移动位置
  - 不要修改UserMenu或GuestMenu的内部逻辑
  - 不要在mobile端显示sidebar footer

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `frontend-ui-ux`
    - UI布局调整
    - React组件重组

  **Parallelization**:
  - **Can Run In Parallel**: YES (与Task 2同时)
  - **Blocked By**: None
  - **Blocks**: None

  **References**:
  - `app-sidebar.tsx:1-53` - 当前sidebar结构
  - `user-menu.tsx:59-107` - UserMenu组件使用方式
  - `guest-menu.tsx:27-65` - GuestMenu组件使用方式
  - `header.tsx:41-52` - Feedback和UserMenu当前在Header的使用方式

  **Acceptance Criteria**:
  - [ ] Sidebar底部显示用户头像/设置图标
  - [ ] 点击用户图标弹出UserMenu/GuestMenu下拉菜单
  - [ ] Desktop端Feedback按钮在sidebar底部可见
  - [ ] 仅在有用户认证时显示UserMenu（已有逻辑）
  - [ ] Mobile端sidebar不显示footer（使用drawer方式）

  **QA Scenarios**:

  ```
  Scenario: Sidebar footer visible on desktop
    Tool: Playwright
    Steps:
      1. Navigate to /
      2. Click sidebar toggle to open
      3. Verify .sidebar-footer or [data-sidebar="footer"] exists
      4. Verify user avatar or settings icon visible
      5. Click avatar
      6. Verify dropdown menu opens
    Expected: User menu dropdown appears with Theme/Links/Logout
    Evidence: .sisyphus/evidence/task-1-sidebar-footer.png

  Scenario: Feedback button in sidebar
    Tool: Playwright
    Steps:
      1. Navigate to /
      2. Open sidebar
      3. Find and click "Feedback" button in sidebar footer
      4. Verify FeedbackModal opens
    Expected: Feedback modal appears with sentiment options
    Evidence: .sisyphus/evidence/task-1-feedback-modal.png
  ```

  **Commit**: YES
  - Message: `feat(ui): move user menu and feedback to sidebar footer`
  - Files: `components/app-sidebar.tsx`

- [ ] 2. 简化Header组件

  **What to do**:
  - 修改 `header.tsx`，移除Feedback按钮和UserMenu/GuestMenu
  - 保留Header结构用于可能的未来用途，或完全简化
  - 由于所有控件已移动到sidebar，Header可以大幅简化或移除
  - 需要检查是否有其他组件依赖Header的存在

  **Must NOT do**:
  - 不要删除header.tsx文件（可能影响其他导入）
  - 不要移除FeedbackModal的导入（还在sidebar中使用）

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `frontend-ui-ux`

  **Parallelization**:
  - **Can Run In Parallel**: YES (与Task 1同时)
  - **Blocked By**: None
  - **Blocks**: None

  **References**:
  - `header.tsx:1-62` - 当前Header组件
  - `layout.tsx:85-87` - Header在layout中的使用

  **Acceptance Criteria**:
  - [ ] Header不再显示Feedback按钮
  - [ ] Header不再显示UserMenu/GuestMenu
  - [ ] Header可以保持占位或完全移除（根据实际需求）

  **QA Scenarios**:

  ```
  Scenario: Header simplified
    Tool: Playwright
    Steps:
      1. Navigate to /
      2. Verify top-right corner does NOT have Feedback button
      3. Verify top-right corner does NOT have user avatar
    Expected: Header area clean, no user controls
    Evidence: .sisyphus/evidence/task-2-header-clean.png
  ```

  **Commit**: YES
  - Message: `refactor(ui): simplify header by removing moved controls`
  - Files: `components/header.tsx`

- [ ] 3. 移除Sidebar和Inspector的互斥逻辑

  **What to do**:
  - 修改 `artifact-context.tsx`
  - 删除第72-76行的useEffect（关闭sidebar时关闭inspector）
  - 修改第79-82行的open函数，移除`setOpen(false)`调用
  - 确保sidebar和inspector可以独立控制

  **Must NOT do**:
  - 不要删除open/close函数的其他逻辑
  - 不要修改state管理的reducer

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (与Task 4, 5同时)
  - **Blocked By**: None
  - **Blocks**: None

  **References**:
  - `artifact-context.tsx:72-82` - 互斥逻辑所在位置

  **Acceptance Criteria**:
  - [ ] 打开sidebar时inspector不会自动关闭
  - [ ] 打开inspector时sidebar不会自动关闭
  - [ ] 两者可以同时打开

  **QA Scenarios**:

  ```
  Scenario: Sidebar and inspector coexist
    Tool: Playwright
    Steps:
      1. Navigate to /search/[id] with some results
      2. Click to open inspector panel
      3. Click sidebar toggle to open sidebar
      4. Verify both sidebar and inspector are visible
    Expected: Both panels open simultaneously
    Evidence: .sisyphus/evidence/task-3-coexist.png
  ```

  **Commit**: YES
  - Message: `feat(ui): allow sidebar and inspector to coexist`
  - Files: `components/artifact/artifact-context.tsx`

- [ ] 4. 增加Inspector Panel最大宽度

  **What to do**:
  - 修改 `chat-artifact-container.tsx`
  - 将第17行的`MAX_WIDTH = 800`改为更大的值（如1000或1200）
  - 确保DEFAULT_WIDTH保持不变或适当调整

  **Must NOT do**:
  - 不要将MAX_WIDTH设为超过屏幕宽度
  - 不要修改MIN_WIDTH或CHAT_MIN_WIDTH

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (与Task 3, 5同时)
  - **Blocked By**: None
  - **Blocks**: None

  **References**:
  - `chat-artifact-container.tsx:15-18` - 宽度常量定义

  **Acceptance Criteria**:
  - [ ] MAX_WIDTH增加到1000（或更大）
  - [ ] Inspector可以resize到新的最大宽度
  - [ ] 宽度保存在localStorage中

  **QA Scenarios**:

  ```
  Scenario: Inspector resizable to larger width
    Tool: Playwright
    Steps:
      1. Navigate to /search/[id]
      2. Open inspector panel
      3. Drag resize handle to right
      4. Verify panel can be made wider than 800px
    Expected: Panel resizes to 1000px+
    Evidence: .sisyphus/evidence/task-4-wide-inspector.png
  ```

  **Commit**: YES
  - Message: `feat(ui): increase inspector panel max width to 1000px`
  - Files: `components/artifact/chat-artifact-container.tsx`

- [ ] 5. 移除Inspector Panel顶部Padding

  **What to do**:
  - 修改 `inspector-panel.tsx`
  - 将第60行的`md:px-4 md:pt-14 md:pb-4`改为`md:px-4 md:pt-0 md:pb-4`
  - 或者完全移除md:pt-14
  - 确保inspector panel延伸到页面顶部

  **Must NOT do**:
  - 不要移除mobile的padding（可能有特殊处理）
  - 不要修改panel内部内容的padding

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (与Task 3, 4同时)
  - **Blocked By**: None
  - **Blocks**: None

  **References**:
  - `inspector-panel.tsx:60` - 包含md:pt-14的元素

  **Acceptance Criteria**:
  - [ ] Inspector panel顶部没有padding/空白
  - [ ] Panel内容从顶部开始
  - [ ] Title bar仍然可见

  **QA Scenarios**:

  ```
  Scenario: Inspector extends to top
    Tool: Playwright
    Steps:
      1. Navigate to /search/[id]
      2. Open inspector panel
      3. Verify panel starts at very top of viewport
      4. Verify no gap between panel and window top
    Expected: Panel touches top of window
    Evidence: .sisyphus/evidence/task-5-full-height.png
  ```

  **Commit**: YES
  - Message: `feat(ui): extend inspector panel to full height`
  - Files: `components/inspector/inspector-panel.tsx`

- [ ] 6. 综合验证

  **What to do**:
  - 运行 `bun lint` 确保没有语法错误
  - 运行 `bun typecheck` 确保类型正确
  - 手动测试所有修改协同工作
  - 验证mobile端体验未降级

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Task 1-5
  - **Blocks**: None

  **Acceptance Criteria**:
  - [ ] 所有lint检查通过
  - [ ] 所有类型检查通过
  - [ ] Desktop: sidebar和inspector可同时打开
  - [ ] Desktop: UserMenu在sidebar底部
  - [ ] Desktop: inspector延伸到顶部且可更宽
  - [ ] Mobile: 使用drawer，体验不变

  **QA Scenarios**:

  ```
  Scenario: Full verification
    Tool: Playwright + Bash
    Steps:
      1. Run bun lint
      2. Run bun typecheck
      3. Open browser at /
      4. Test all desktop scenarios
      5. Test mobile viewport
      6. Verify no console errors
    Expected: All checks pass
    Evidence: .sisyphus/evidence/task-6-final.png
  ```

  **Commit**: NO (已包含在各自task的commit中)

---

## Final Verification Wave

- [ ] F1. **代码质量检查** — `unspecified-low`
      Run `bun lint` and `bun typecheck`. Verify no new errors introduced.
      Output: `Lint [PASS/FAIL] | TypeCheck [PASS/FAIL]`

- [ ] F2. **布局验证** — `visual-engineering`
      Screenshot test: Desktop with both sidebar and inspector open.
      Verify: Sidebar footer has user controls, inspector touches top, wider resize possible.
      Output: `Layout [PASS/FAIL]`

- [ ] F3. **Mobile验证** — `unspecified-low`
      Test mobile viewport. Verify inspector still uses drawer, sidebar uses mobile sheet.
      No mobile-specific regressions.
      Output: `Mobile [PASS/FAIL]`

---

## Success Criteria

### Verification Commands

```bash
# Lint and type check
bun lint
bun typecheck

# Build verification
bun run build
```

### Visual Checklist

- [ ] Sidebar底部显示用户头像和Feedback按钮
- [ ] Header右上角不再显示用户控件
- [ ] 可以同时打开sidebar和inspector
- [ ] Inspector panel延伸到页面顶部
- [ ] Inspector可resize到1000px宽度
- [ ] Mobile端inspector仍是底部drawer

---

## File Summary

| 文件                          | 修改内容                                         |
| ----------------------------- | ------------------------------------------------ |
| `app-sidebar.tsx`             | 添加SidebarFooter，包含Feedback和User/Guest Menu |
| `header.tsx`                  | 移除Feedback和UserMenu相关代码                   |
| `artifact-context.tsx`        | 删除互斥useEffect和setOpen(false)                |
| `chat-artifact-container.tsx` | MAX_WIDTH 800 → 1000                             |
| `inspector-panel.tsx`         | md:pt-14 → md:pt-0                               |
