import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import 'ant-design-vue/es/message/style/css';
import PortalVue from 'portal-vue'
import piniaPersist from 'pinia-plugin-persist'

import { router } from './router';
import { createPinia } from 'pinia';
const pinia = createPinia();
pinia.use(piniaPersist);

createApp(App).use(router).use(pinia).use(PortalVue).mount('#app')
