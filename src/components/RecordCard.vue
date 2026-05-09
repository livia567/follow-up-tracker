<template>
  <div class="card" :class="{ 'card--deleting': isDeleting }" @click="toggleExpand">
    <!-- 左侧色条 -->
    <div class="card__accent"></div>

    <div class="card__body">
      <div class="card__header">
        <h3 class="card__title">{{ record.title }}</h3>
        <span class="card__date">{{ record.date }}</span>
      </div>

      <p class="card__detail" :class="{ 'card__detail--expanded': expanded }">
        {{ record.detail }}
      </p>

      <!-- 展开后显示的额外信息 -->
      <Transition name="expand">
        <div class="card__extra" v-if="expanded && (record.nextTime || record.nextContent)">
          <div class="card__extra-item" v-if="record.nextTime">
            <span class="card__extra-label">下次沟通时间</span>
            <span class="card__extra-value">{{ record.nextTime }}</span>
          </div>
          <div class="card__extra-item" v-if="record.nextContent">
            <span class="card__extra-label">下次沟通内容</span>
            <span class="card__extra-value">{{ record.nextContent }}</span>
          </div>
        </div>
      </Transition>

      <!-- 底部操作栏 -->
      <div class="card__footer">
        <span class="card__expand-hint">{{ expanded ? '收起' : '查看详情' }}</span>
        <button class="card__delete" @click.stop="handleDelete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="M19,6l-1,14H6L5,6"></path>
            <path d="M10,11v6M14,11v6"></path>
            <path d="M9,6V4h6v2"></path>
          </svg>
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  record: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['delete'])

const expanded = ref(false)
const isDeleting = ref(false)

function toggleExpand() {
  expanded.value = !expanded.value
}

async function handleDelete() {
  isDeleting.value = true
  setTimeout(() => {
    emit('delete', props.record.id)
  }, 300)
}
</script>

<style scoped>
.card {
  display: flex;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.08);
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card:active {
  transform: scale(0.98);
}

.card--deleting {
  opacity: 0;
  transform: translateX(100%);
}

.card__accent {
  width: 4px;
  background: linear-gradient(180deg, #6366f1, #8b5cf6);
  flex-shrink: 0;
}

.card__body {
  flex: 1;
  padding: 14px 16px;
  min-width: 0;
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}

.card__title {
  font-size: 15px;
  font-weight: 600;
  color: #1e1b4b;
  line-height: 1.4;
  flex: 1;
  min-width: 0;
}

.card__date {
  font-size: 12px;
  color: #a5b4fc;
  flex-shrink: 0;
  background: #eef2ff;
  padding: 2px 8px;
  border-radius: 20px;
}

.card__detail {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: all 0.3s ease;
}

.card__detail--expanded {
  -webkit-line-clamp: unset;
  display: block;
}

.card__extra {
  margin-top: 10px;
  padding: 10px 12px;
  background: #f5f3ff;
  border-radius: 10px;
}

.card__extra-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}

.card__extra-item:last-child {
  margin-bottom: 0;
}

.card__extra-label {
  font-size: 11px;
  color: #8b5cf6;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card__extra-value {
  font-size: 13px;
  color: #4c1d95;
}

.card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
}

.card__expand-hint {
  font-size: 12px;
  color: #a5b4fc;
}

.card__delete {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #f87171;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.card__delete:active {
  background: #fef2f2;
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 200px;
}
</style>