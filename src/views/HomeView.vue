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

 <!-- 删除二次确认 -->
<Transition name="overlay">
  <div class="overlay" v-if="showDeleteConfirm" @click.self="showDeleteConfirm = false">
    <Transition name="dialog">
      <div class="dialog" v-if="showDeleteConfirm">
        <h3 class="dialog__title">确认删除？</h3>
        <p class="dialog__desc">删除后不可恢复</p>
        <div class="dialog__actions">
          <button class="btn btn--secondary" @click="showDeleteConfirm = false">取消</button>
          <button class="btn btn--danger" @click="confirmDelete">确认删除</button>
        </div>
      </div>
    </Transition>
  </div>
</Transition>
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
const showDeleteConfirm = ref(false)
const deleteTargetId = ref(null)

async function confirmDelete() {
  await store.remove(deleteTargetId.value)
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}

// 初始加载
onMounted(() => {
  store.loadFirst()
})

// 跳转添加页
function goToAdd() {
  router.push('/add')
}

// 删除记录
function handleDelete(id) {
  showConfirmDialog(id)
}

function showConfirmDialog(id) {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
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

/* 顶部 */
.header {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  padding: 52px 24px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header__title {
  font-size: 17px;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.3px;
}

.header__badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f5f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #86868b;
  border: 1px solid rgba(0,0,0,0.06);
}

/* Tab */
.tabs {
  display: flex;
  gap: 0;
}

.tab {
  flex: 1;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 400;
  color: #86868b;
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 1.5px solid transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  letter-spacing: -0.1px;
}

.tab--active {
  color: #1d1d1f;
  border-bottom-color: #1d1d1f;
  font-weight: 500;
}

.tab__count {
  background: #f5f5f7;
  color: #86868b;
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.06);
}

/* 内容区 */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px 100px;
  -webkit-overflow-scrolling: touch;
}

/* 下拉刷新 */
.refresh-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 0;
  overflow: hidden;
  font-size: 13px;
  color: #86868b;
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
  padding: 80px 0;
  gap: 8px;
}

.empty p {
  font-size: 15px;
  font-weight: 500;
  color: #1d1d1f;
}

.empty span {
  font-size: 13px;
  color: #86868b;
}

/* 占位 */
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 12px;
  color: #86868b;
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
  color: #86868b;
}

/* spinner */
.spinner {
  width: 18px;
  height: 18px;
  border: 1.5px solid #e5e5ea;
  border-top-color: #1d1d1f;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* FAB */
.fab {
  position: fixed;
  bottom: 32px;
  right: calc(50% - 215px + 20px);
  width: 48px;
  height: 48px;
  background: #1d1d1f;
  border: none;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fab:active {
  transform: scale(0.93);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 0 48px;
}

.dialog {
  background: #fff;
  width: 100%;
  max-width: 270px;
  border-radius: 16px;
  overflow: hidden;
}

.dialog__title {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  text-align: center;
  padding: 20px 20px 4px;
  letter-spacing: -0.3px;
}

.dialog__desc {
  font-size: 13px;
  color: #86868b;
  text-align: center;
  padding: 0 20px 20px;
  font-weight: 300;
}

.dialog__actions {
  display: flex;
  border-top: 1px solid rgba(0,0,0,0.08);
}

.btn {
  flex: 1;
  padding: 14px;
  font-size: 15px;
  font-weight: 400;
  border: none;
  cursor: pointer;
  background: #fff;
  font-family: inherit;
  transition: background 0.15s;
}

.btn--secondary {
  color: #1d1d1f;
  border-right: 1px solid rgba(0,0,0,0.08);
}

.btn--secondary:active {
  background: #f5f5f7;
}

.btn--danger {
  color: #ff3b30;
  font-weight: 500;
}

.btn--danger:active {
  background: #fff2f2;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.2s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.25s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.92);
}
</style>