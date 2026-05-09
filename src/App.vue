<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f5f5f7;
  min-height: 100vh;
}

.app-container {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f5f5f7;
  position: relative;
}
</style>