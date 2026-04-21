# 产品改进需求 (Need Improve)

记录在产品体验过程中发现的设计和功能改进需求。

---

## AI 功能优化

### [P0] 流式输出显示（Streaming Response）
**问题描述：**
点击 AI 生成相关按钮后，页面内容一次性全部输出。在大模型思考过程中（10-30秒），用户完全不知道发生了什么，也不知道 AI 是否在工作，体验中断。

**影响：**
- 用户等待时看到空白页面或加载动画，不知道 AI 在哪个阶段
- 无法感知工具调用的中间状态（"正在查询天气..."、"正在搜索景点..."）
- 等待时间长时用户可能重复点击或认为系统卡死

**解决方案：**
```
后端：
- 将 /ai/chat 接口改为 SSE (Server-Sent Events) 流式响应
- 支持增量输出：工具调用开始 → 工具调用结束 → AI 思考中 → 最终回复
- 返回格式：event: tool_call\ndata: {...}\nevent: tool_result\ndata: {...}\nevent: chunk\ndata: "部分回复内容"\nevent: done\n

前端：
- 使用 EventSource 或 fetch + ReadableStream 接收 SSE
- 实时渲染 AI 的中间状态（"🔍 正在查询东京天气..."）
- 流式显示 AI 回复文字，逐字/逐句出现
- 显示工具调用卡片（如天气卡片、景点列表卡片）
```

**涉及文件：**
- `backend/src/ai/ai.controller.ts` - 改为返回流式响应
- `backend/src/ai/ai.service.ts` - 改造为事件发射器模式
- `frontend/src/screens/AIAssistant.tsx` - 实现 SSE 接收和流式渲染

**优先级：** P0（阻断性体验问题）

---

### [P0] Agent 记忆功能（Memory System）
**问题描述：**
当前所有 Agent 都没有记忆功能，每次对话都是独立的。用户最开始设置的信息（目的地、出行日期、人数、偏好）在后续对话中丢失。AI 无法记住用户在行程中做的修改和决策。

**影响：**
- 用户在 Trip Wizard 设置的信息（目的地、人数、预算）在进入 AI Assistant 后完全丢失
- 用户在 AI 建议后说"把第二天行程改成下午出发"，AI 不会记住这个偏好
- 每次进入 AI Assistant 都是全新的对话，上下文需要用户重复描述
- 中途修改行程（如"把东京改成大阪"）后，之前的信息不会联动更新

**解决方案：**

**短期记忆（会话级）：**
```
- 在 AiService 中维护当前会话的 context 池
- 自动从以下来源提取并更新 context：
  - Trip Wizard 设置的 trip 基本信息（目的地、日期、人数）
  - 当前 trip 的 itinerary 数据
  - 用户在对话中明确表达的偏好（"我更喜欢自然风光"、"不要太累"）
- context 在会话结束后清理
```

**长期记忆（Trip 级）：**
```
- 将重要的用户偏好和决策持久化到数据库（Prisma）
- 存储内容：
  - trip_id, user_id, preference_type, preference_value, updated_at
  - 例：trip_123, preference=" pace", value="relaxed"
  - 例：trip_123, itinerary_change="第二天改为下午出发"
- 在以下时机更新长期记忆：
  - 用户在 AI Assistant 中明确修改行程
  - 用户通过投票/评论确认某个活动
  - AI 建议被采纳时记录
```

**记忆数据结构示例：**
```typescript
// 长期记忆（Prisma）
model TripMemory {
  id              String   @id @default(uuid())
  tripId          String
  userId          String
  memoryType      String   // "preference" | "itinerary_change" | "constraint"
  content         String   // JSON: { "key": "pace", "value": "relaxed" }
  source          String   // "ai_suggestion" | "user_feedback" | "vote_result"
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// 短期记忆（内存）
interface ShortTermMemory {
  currentTripContext: TripContext        // 从 trip 表同步
  userExplicitPreferences: Preference[]  // 用户明确表达的
  pendingChanges: ItineraryChange[]     // 待确认的修改
  recentDecisions: Decision[]           // 最近的决定（用于上下文）
}
```

**前端交互设计：**
- 首次进入 AI Assistant 时，显示"记忆已加载"提示
- 用户说"保持上午出发"时，AI 应回应"已记住，会在后续规划中考虑"
- 支持"清除记忆"按钮让用户重置

**涉及文件：**
- `backend/src/ai/ai.service.ts` - 添加短期记忆管理
- `backend/src/ai/memory.service.ts` (新建) - 长期记忆 CRUD
- `backend/prisma/schema.prisma` - 添加 TripMemory 模型
- `frontend/src/screens/AIAssistant.tsx` - 显示记忆状态

**优先级：** P0（核心产品逻辑缺失）

---

### [P0] 城市名称解析精度问题
**问题描述：**
Amap geocoding 将 "Tokyo" 错误解析为"平南县"（中国广西），导致天气和景点搜索结果完全错误。

**影响：**
- 用户询问"东京天气"时返回的是广西平南县的天气
- 景点搜索返回空结果

**解决方案：**
- 在 AmapService 请求时添加国家/地区限定（如 "Tokyo, Japan" → 使用日文 "東京" 或添加 country=JP 参数）
- 或使用更精确的坐标数据作为回退
- 考虑在调用前验证解析结果的可靠性

**优先级：** P0

---

### [P1] AI 回复质量监控
**问题描述：**
无法追踪 AI 调用了哪些工具、调用多少次、响应时间等运营数据。

**解决方案：**
- 添加 AI 调用日志（工具名称、参数、响应时间、结果质量）
- 统计每轮对话的平均工具调用次数
- 记录 fallback 触发频率

**优先级：** P1

---

### [P2] AI 回复速度优化
**问题描述：**
当前工具调用响应时间约 10-30 秒，用户体验不佳。

**解决方案：**
- 考虑并行调用多个独立工具（当前是串行）
- 添加流式输出支持（SSE）让用户看到中间步骤
- 添加"正在查询..."等加载状态

**优先级：** P2

---

## 产品体验优化

### [P1] 景点推荐增加评分/排名
**问题描述：**
当前 AI 推荐的景点没有官方评分和排名依据，用户难以判断优先级。

**解决方案：**
- 从 Amap POI 数据中提取评分/热度信息
- 在推荐结果中显示景点评分（如 4.5/5）和点评数量
- 支持按评分/热度排序

**优先级：** P1

---

### [P2] 行程推荐增加地图预览
**问题描述：**
纯文字的行程推荐不够直观，用户无法感知景点之间的地理位置关系。

**解决方案：**
- 在 AI Draft 或行程确认页面添加简易地图
- 高亮显示当天行程的景点位置
- 支持查看景点之间的路线

**优先级：** P2

---

### [P2] 用户反馈机制
**问题描述：**
用户无法对 AI 推荐结果提供反馈（有用/无用），无法持续优化模型表现。

**解决方案：**
- 在 AI 推荐结果旁添加 👍/👎 反馈按钮
- 记录用户反馈到对话历史或单独存储
- 用于后续分析和模型调优

**优先级：** P2

---

## 技术债务

### [P1] Session 持久化
**问题描述：**
当前 AiService 使用内存 Map 存储会话，重启后丢失。

**解决方案：**
- 将会话存储到数据库（Prisma）
- 支持会话历史查询和跨设备恢复

**优先级：** P1

---

### [P2] 错误处理优化
**问题描述：**
AI 服务出错时直接返回 500，用户体验不佳。

**解决方案：**
- 添加更友好的错误提示（"网络繁忙，请稍后再试"）
- 实现重试机制（指数退避）
- 添加断路器模式防止级联失败

**优先级：** P2

---

## 优先级说明

- **P0**：阻断性问题，必须立即修复
- **P1**：重要功能，影响核心体验
- **P2**：体验优化，可以后续迭代

---

*最后更新：2026-04-21*（新增流式输出 P0、Agent 记忆功能 P0）
