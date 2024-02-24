// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import RegisterComponent from '@/views/RegisterComponent.vue';

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: RegisterComponent
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
