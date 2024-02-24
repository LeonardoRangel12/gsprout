import { createRouter, createWebHistory } from "vue-router";
import LoginComponentVue from "../components/LoginComponent.vue";
import RegisterComponentVue from "../components/RegisterComponent.vue";
import MainComponentVue from "../components/MainComponent.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginComponentVue
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterComponentVue
        },
        {
            path: '/main',
            name: 'main',
            component: MainComponentVue
        }

    ]
})

export default router