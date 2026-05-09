<template>
  <div class="home">
    <!-- 顶部渐变栏 -->
    <div class="header">
      <div class="header__top">
        <h1 class="header__title">DevopsGPT</h1>
        <div class="header__badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
      </div>

      <!-- Tab切换 -->
      <div class="tabs">
        <button class="tab" :class="{ 'tab--active': activeTab === 'detail' }" @click="activeTab = 'detail'">
          项目详情
        </button>
        <button class="tab" :class="{ 'tab--active': activeTab === 'records' }" @click="activeTab = 'records'">
          跟进记录
          <span class="tab__count" v-if="store.recordCount > 0">{{ store.recordCount }}</span>
        </button>
      </div>
    </div>

    <!-- 项目详情tab -->
    <div class="content" v-if="activeTab === 'detail'">
      <div class="placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c7d2fe" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <p>项目详情页面</p>
      </div>
    </div>

    <!-- 跟进记录tab -->
    <div
      class="content"
      v-else
      ref="scrollContainer"
      @scroll="handleScroll"
    >
      <!-- 下拉刷新指示器 -->
      <div class="refresh-indicator" :class="{ 'refresh-indicator--visible': store.refreshing }">
        <div class="spinner"></div>
        <span>刷新中...</span>
      </div>

      <!-- 列表 -->
      <div class="list" v-if="store.records.length > 0">
        <RecordCard
          v-for="record in store.records"
          :key="record.id"
          :record="record"
          @delete="handleDelete"
        />
      </div>

      <!-- 空状态 -->
      <div class="empty" v-else-if="!store.loading">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#c7d2fe" stroke-width="1">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
        <p>暂无跟进记录</p>
        <span>点击右下角 + 添加第一条</span>
      </div>

      <!-- 加载更多 -->
      <div class="load-more" v-if="store.records.length > 0">
        <div class="spinner" v-if="store.loading"></div>
        <span v-else-if="!store.hasMore">已经到底了 ~</span>
      </div>
    </div>

    <!-- 添加按钮 -->
    <button class="fab" @click="goToAdd" v-if="activeTab === 'records'">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRecordStore } from '../stores/recordStore'
import RecordCard from '../components/RecordCard.vue'

const router = useRouter()
const store = useRecordStore()
const activeTab = ref('records')
const scrollContainer = ref(null)

// 初始加载
onMounted(() => {
  store.loadFirst()
})

// 跳转添加页
function goToAdd() {
  router.push('/add')
}

// 删除记录
async function handleDelete(id) {
  await store.remove(id)
}

// 滚动处理：到底加载更多
function handleScroll() {
  const el = scrollContainer.value
  if (!el) return
  const { scrollTop, scrollHeight, clientHeight } = el
  if (scrollHeight - scrollTop - clientHeight < 60) {
    store.loadMore()
  }
}

// 下拉刷新
let startY = 0
let isPulling = false

onMounted(() => {
  const el = scrollContainer.value
  if (!el) return

  el.addEventListener('touchstart', (e) => {
    if (el.scrollTop === 0) {
      startY = e.touches[0].clientY
      isPulling = true
    }
  })

  el.addEventListener('touchend', (e) => {
    if (!isPulling) return
    const endY = e.changedTouches[0].clientY
    if (endY - startY > 60) {
      store.refresh()
    }
    isPulling = false
  })
})
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 顶部渐变栏 */
.header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 48px 20px 0;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
}

.header__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header__title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}

.header__badge {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

/* Tab */
.tabs {
  display: flex;
  gap: 4px;
}

.tab {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.tab--active {
  color: #fff;
  border-bottom-color: #fff;
}

.tab__count {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 20px;
}

/* 内容区 */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 80px;
  -webkit-overflow-scrolling: touch;
}

/* 下拉刷新指示器 */
.refresh-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 0;
  overflow: hidden;
  font-size: 13px;
  color: #8b5cf6;
  transition: height 0.3s;
}

.refresh-indicator--visible {
  height: 40px;
}

/* 空状态 */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 12px;
}

.empty p {
  font-size: 16px;
  font-weight: 600;
  color: #c7d2fe;
}

.empty span {
  font-size: 13px;
  color: #d1d5db;
}

/* 占位 */
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 12px;
  color: #c7d2fe;
  font-size: 14px;
}

/* 加载更多 */
.load-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  min-height: 48px;
  font-size: 13px;
  color: #d1d5db;
}

/* spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e0e7ff;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* FAB */
.fab {
  position: fixed;
  bottom: 28px;
  right: calc(50% - 215px + 20px);
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.45);
  transition: transform 0.2s, box-shadow 0.2s;
}

.fab:active {
  transform: scale(0.92);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}
</style>