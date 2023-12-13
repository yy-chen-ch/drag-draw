import { createApp } from 'vue'
import './assets/css/index.scss'
import App from './App.vue'
import router from './router/index.js';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(ElementPlus).use(router).mount('#app')
