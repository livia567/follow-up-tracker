<template>
  <div class="add-page">
    <!-- 顶部渐变栏 -->
    <div class="header">
      <button class="header__back" @click="handleCancel">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <h1 class="header__title">添加跟进记录</h1>
      <div class="header__placeholder"></div>
    </div>

    <!-- 表单 -->
    <div class="form-container">
      <!-- 沟通主题 -->
      <div class="field" :class="{ 'field--error': errors.title }">
        <label class="field__label">
          沟通主题
          <span class="field__required">*</span>
        </label>
        <input
          class="field__input"
          v-model="form.title"
          placeholder="请输入沟通主题"
          maxlength="50"
          @input="clearError('title')"
        />
        <div class="field__footer">
          <span class="field__error" v-if="errors.title">{{ errors.title }}</span>
          <span class="field__count" v-else>{{ form.title.length }}/50</span>
        </div>
      </div>

      <!-- 沟通详情 -->
      <div class="field" :class="{ 'field--error': errors.detail }">
        <label class="field__label">
          沟通详情
          <span class="field__required">*</span>
        </label>
        <textarea
          class="field__textarea"
          v-model="form.detail"
          placeholder="请输入沟通详情"
          maxlength="200"
          rows="4"
          @input="clearError('detail')"
        ></textarea>
        <div class="field__footer">
          <span class="field__error" v-if="errors.detail">{{ errors.detail }}</span>
          <span class="field__count" v-else>{{ form.detail.length }}/200</span>
        </div>
      </div>

      <!-- 下次沟通时间 -->
      <div class="field">
        <label class="field__label">下次沟通时间</label>
        <input
          class="field__input"
          type="datetime-local"
          v-model="form.nextTime"
        />
      </div>

      <!-- 下次沟通内容 -->
      <div class="field">
        <label class="field__label">下次沟通内容</label>
        <textarea
          class="field__textarea"
          v-model="form.nextContent"
          placeholder="请输入下次沟通内容"
          maxlength="200"
          rows="3"
        ></textarea>
      </div>

      <!-- 按钮组 -->
      <div class="actions">
        <button class="btn btn--secondary" @click="handleCancel">取消</button>
        <button class="btn btn--primary" @click="handleSubmit" :disabled="submitting">
          <div class="spinner" v-if="submitting"></div>
          <span v-else>保存</span>
        </button>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div class="toast" v-if="showToast">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        保存成功
      </div>
    </Transition>

    <!-- 取消二次确认弹窗 -->
    <Transition name="overlay">
      <div class="overlay" v-if="showConfirm" @click.self="showConfirm = false">
        <Transition name="dialog">
          <div class="dialog" v-if="showConfirm">
            <h3 class="dialog__title">确认离开？</h3>
            <p class="dialog__desc">当前填写的内容将不会保存</p>
            <div class="dialog__actions">
              <button class="btn btn--secondary" @click="showConfirm = false">继续编辑</button>
              <button class="btn btn--danger" @click="confirmCancel">确认离开</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useRecordStore } from '../stores/recordStore'

const router = useRouter()
const store = useRecordStore()

const form = reactive({
  title: '',
  detail: '',
  nextTime: '',
  nextContent: '',
})

const errors = reactive({
  title: '',
  detail: '',
})

const submitting = ref(false)
const showToast = ref(false)
const showConfirm = ref(false)

function clearError(field) {
  errors[field] = ''
}

function validate() {
  let valid = true
  if (!form.title.trim()) {
    errors.title = '沟通主题不能为空'
    valid = false
  }
  if (!form.detail.trim()) {
    errors.detail = '沟通详情不能为空'
    valid = false
  }
  return valid
}

function hasContent() {
  return form.title.trim() || form.detail.trim() || form.nextTime || form.nextContent.trim()
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    await store.add({ ...form })
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
      router.back()
    }, 1200)
  } finally {
    submitting.value = false
  }
}

function handleCancel() {
  if (hasContent()) {
    showConfirm.value = true
  } else {
    router.back()
  }
}

function confirmCancel() {
  showConfirm.value = false
  router.back()
}
</script>

<style scoped>
.add-page {
  min-height: 100vh;
  background: #f0f2f8;
  display: flex;
  flex-direction: column;
}

/* 顶部渐变栏 */
.header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 48px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
  flex-shrink: 0;
}

.header__back {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.header__back:active {
  background: rgba(255, 255, 255, 0.35);
}

.header__title {
  font-size: 17px;
  font-weight: 600;
  color: #fff;
}

.header__placeholder {
  width: 36px;
}

/* 表单 */
.form-container {
  padding: 20px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  background: #fff;
  border-radius: 16px;
  padding: 14px 16px;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.06);
  transition: box-shadow 0.2s;
}

.field--error {
  box-shadow: 0 2px 12px rgba(239, 68, 68, 0.15);
}

.field__label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
}

.field__required {
  color: #f87171;
  margin-left: 2px;
}

.field__input,
.field__textarea {
  width: 100%;
  border: none;
  outline: none;
  font-size: 15px;
  color: #1e1b4b;
  background: transparent;
  font-family: inherit;
  resize: none;
}

.field__input::placeholder,
.field__textarea::placeholder {
  color: #d1d5db;
}

.field__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
  min-height: 18px;
}

.field__error {
  font-size: 12px;
  color: #f87171;
  flex: 1;
}

.field__count {
  font-size: 12px;
  color: #d1d5db;
}

/* 按钮组 */
.actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn {
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn--primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn--primary:active {
  transform: scale(0.97);
}

.btn--primary:disabled {
  opacity: 0.7;
}

.btn--secondary {
  background: #fff;
  color: #6366f1;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
}

.btn--secondary:active {
  background: #f5f3ff;
}

.btn--danger {
  background: #fee2e2;
  color: #ef4444;
}

.btn--danger:active {
  background: #fecaca;
}

/* spinner */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toast */
.toast {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e1b4b;
  color: #fff;
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  z-index: 100;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

/* 弹窗 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  z-index: 200;
  backdrop-filter: blur(2px);
}

.dialog {
  background: #fff;
  width: 100%;
  border-radius: 24px 24px 0 0;
  padding: 28px 24px 40px;
}

.dialog__title {
  font-size: 17px;
  font-weight: 700;
  color: #1e1b4b;
  margin-bottom: 8px;
}

.dialog__desc {
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 24px;
}

.dialog__actions {
  display: flex;
  gap: 12px;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  transform: translateY(100%);
}
</style>