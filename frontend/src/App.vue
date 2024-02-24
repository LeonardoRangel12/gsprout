<script setup>
import LoginComponent from './components/LoginComponent.vue';
import RegisterComponent from './components/RegisterComponent.vue';
import MainComponent from './components/MainComponent.vue';
</script>

<template>
  <LoginComponent />
  <RegisterComponent />
  <MainComponent />
</template>

<style>
.app {
  display: flex;
}

.content {
  flex: 1;
}
</style>
