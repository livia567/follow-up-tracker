const STORAGE_KEY = 'follow_up_records'
const PAGE_SIZE = 5

// 初始化mock数据
const mockData = [
  {
    id: 1,
    title: '星巴克咖啡商谈细节',
    detail: '沟通投资细节。',
    nextTime: '2026-06-07 13:40:00',
    nextContent: '',
    date: '06-09',
    createdAt: new Date('2026-03-09').getTime(),
  },
  {
    id: 2,
    title: '跨赴科技办公室深入了解',
    detail: '深入沟通项目，了解产品和业务的进展，打算投一个亿。',
    nextTime: '',
    nextContent: '',
    date: '06-08',
    createdAt: new Date('2026-03-10').getTime(),
  },
  {
    id: 3,
    title: '奇绩 DemoDay',
    detail: '第一次在DemoDay上接触，印象不错。',
    nextTime: '',
    nextContent: '',
    date: '06-07',
    createdAt: new Date('2026-04-07').getTime(),
  },
  {
    id: 4,
    title: '线上会议初步沟通',
    detail: '通过Zoom进行了初步的项目介绍，对方团队背景强。',
    nextTime: '2026-06-10 15:00:00',
    nextContent: '准备详细的财务数据',
    date: '06-06',
    createdAt: new Date('2026-04-20').getTime(),
  },
  {
    id: 5,
    title: '路演活动偶遇',
    detail: '在创业路演上认识，交换了名片，约好下周详聊。',
    nextTime: '',
    nextContent: '',
    date: '06-05',
    createdAt: new Date('2026-04-25').getTime(),
  },
  {
    id: 6,
    title: '产品演示会议',
    detail: '向对方团队演示了核心功能，反馈积极。',
    nextTime: '2026-06-12 10:00:00',
    nextContent: '发送产品白皮书',
    date: '06-04',
    createdAt: new Date('2026-05-03').getTime(),
  },
  {
    id: 7,
    title: '投委会前沟通',
    detail: '投委会开会前的最后一次确认沟通。',
    nextTime: '',
    nextContent: '',
    date: '06-03',
    createdAt: new Date('2026-05-09').getTime(),
  },
]

// 初始化storage
function initStorage() {
  const existing = localStorage.getItem(STORAGE_KEY)
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData))
  }
}

// 获取所有记录
function getAllRecords() {
  initStorage()
  const data = localStorage.getItem(STORAGE_KEY)
  return JSON.parse(data)
}

// 模拟分页获取
export function getRecords(page = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getAllRecords()
      const start = (page - 1) * PAGE_SIZE
      const end = start + PAGE_SIZE
      const list = all.slice(start, end)
      resolve({
        list,
        total: all.length,
        hasMore: end < all.length,
        page,
      })
    }, 300)
  })
}

// 添加记录
export function addRecord(record) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getAllRecords()
      const now = new Date()
      const newRecord = {
        id: Date.now(),
        ...record,
        date: `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
        createdAt: now.getTime(),
      }
      all.unshift(newRecord)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
      resolve(newRecord)
    }, 300)
  })
}

// 删除记录
export function deleteRecord(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getAllRecords()
      const filtered = all.filter((r) => r.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
      resolve(true)
    }, 300)
  })
}

// 重置数据（下拉刷新用）
export function resetRecords() {
  localStorage.removeItem(STORAGE_KEY)
  return getRecords(1)
}