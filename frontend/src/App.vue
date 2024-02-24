<script setup>
import LoginComponent from './components/LoginComponent.vue';
import RegisterComponent from './components/RegisterComponent.vue';
import MainComponent from './components/MainComponent.vue';
import navbarComponent from './components/navbarComponent.vue';
</script>

<template>
  <LoginComponent />
  <RegisterComponent />
  <MainComponent />
  <navbarComponent />

</template>

<style>
.app {
  display: flex;
}

.content {
  flex: 1;
}
</style>
