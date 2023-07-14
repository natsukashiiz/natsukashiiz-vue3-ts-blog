import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Naive from 'naive-ui';
import { createI18n } from 'vue-i18n';
import { createHead } from '@vueuse/head';

import App from './App.vue';
import router from './router';

import locales from './locales';

const i18n = createI18n({
    legacy: false, // Set to true if you want to use the Vue 2 syntax for translations
    locale: localStorage.getItem('lang') || 'en',
    globalInjection: true,
    messages: locales
});

const app = createApp(App);
const head = createHead();

app.use(createPinia());
app.use(head);
app.use(i18n);
app.use(router);
app.use(Naive);

app.mount('#app');
