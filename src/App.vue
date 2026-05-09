<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f0f2f8;
  min-height: 100vh;
}

.app-container {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f0f2f8;
  position: relative;
}
</style>