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
  background: #f5f5f7;
  display: flex;
  flex-direction: column;
}

.header {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  padding: 52px 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header__back {
  width: 32px;
  height: 32px;
  background: #f5f5f7;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 50%;
  color: #1d1d1f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.header__back:active {
  background: #e5e5ea;
}

.header__title {
  font-size: 16px;
  font-weight: 500;
  color: #1d1d1f;
  letter-spacing: -0.2px;
}

.header__placeholder {
  width: 32px;
}

.form-container {
  padding: 20px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field {
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: border-color 0.2s;
}

.field--error {
  border-color: #ff3b30;
}

.field__label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #86868b;
  margin-bottom: 6px;
  letter-spacing: 0.2px;
}

.field__required {
  color: #ff3b30;
  margin-left: 2px;
}

.field__input,
.field__textarea {
  width: 100%;
  border: none;
  outline: none;
  font-size: 15px;
  color: #1d1d1f;
  background: transparent;
  font-family: inherit;
  resize: none;
  letter-spacing: -0.2px;
}

.field__input::placeholder,
.field__textarea::placeholder {
  color: #c7c7cc;
  font-weight: 300;
}

.field__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
  min-height: 16px;
}

.field__error {
  font-size: 12px;
  color: #ff3b30;
  flex: 1;
}

.field__count {
  font-size: 12px;
  color: #c7c7cc;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.btn {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  letter-spacing: -0.2px;
}

.btn--primary {
  background: #1d1d1f;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn--primary:active {
  background: #3a3a3c;
  transform: scale(0.98);
}

.btn--primary:disabled {
  opacity: 0.5;
}

.btn--secondary {
  background: #fff;
  color: #1d1d1f;
  border: 1px solid rgba(0,0,0,0.08);
}

.btn--secondary:active {
  background: #f5f5f7;
}

.btn--danger {
  background: #fff2f2;
  color: #ff3b30;
  border: 1px solid rgba(255,59,48,0.15);
}

.btn--danger:active {
  background: #ffe5e3;
}

.spinner {
  width: 17px;
  height: 17px;
  border: 1.5px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.toast {
  position: fixed;
  top: 56px;
  left: 50%;
  transform: translateX(-50%);
  background: #1d1d1f;
  color: #fff;
  padding: 9px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 100;
  letter-spacing: -0.1px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: flex-end;
  z-index: 200;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.dialog {
  background: #fff;
  width: 100%;
  border-radius: 20px 20px 0 0;
  padding: 28px 24px 44px;
}

.dialog__title {
  font-size: 17px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 6px;
  letter-spacing: -0.3px;
}

.dialog__desc {
  font-size: 14px;
  color: #86868b;
  margin-bottom: 24px;
  font-weight: 300;
}

.dialog__actions {
  display: flex;
  gap: 10px;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.25s ease;
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