import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getRecords, addRecord, deleteRecord, resetRecords } from '../services/recordService'

export const useRecordStore = defineStore('record', () => {
  const records = ref([])
  const currentPage = ref(1)
  const hasMore = ref(true)
  const total = ref(0)
  const loading = ref(false)
  const refreshing = ref(false)

  const recordCount = computed(() => total.value)

  // 首次加载 / 下拉刷新
  async function refresh() {
    if (refreshing.value) return
    refreshing.value = true
    try {
      const res = await resetRecords()
      records.value = res.list
      currentPage.value = 1
      hasMore.value = res.hasMore
      total.value = res.total
    } finally {
      refreshing.value = false
    }
  }

  // 加载第一页
  async function loadFirst() {
    if (loading.value) return
    loading.value = true
    try {
      const res = await getRecords(1)
      records.value = res.list
      currentPage.value = 1
      hasMore.value = res.hasMore
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  // 加载下一页
  async function loadMore() {
    if (loading.value || !hasMore.value) return
    loading.value = true
    try {
      const nextPage = currentPage.value + 1
      const res = await getRecords(nextPage)
      records.value.push(...res.list)
      currentPage.value = nextPage
      hasMore.value = res.hasMore
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  // 添加记录
  async function add(record) {
    const newRecord = await addRecord(record)
    records.value.unshift(newRecord)
    total.value += 1
    return newRecord
  }

  // 删除记录
  async function remove(id) {
    await deleteRecord(id)
    records.value = records.value.filter((r) => r.id !== id)
    total.value -= 1
  }

  return {
    records,
    hasMore,
    total,
    loading,
    refreshing,
    recordCount,
    refresh,
    loadFirst,
    loadMore,
    add,
    remove,
  }
})