import { createRouter, createWebHistory } from 'vue-router'

import Workbench from "@/layouts/workbench.vue";

import Login from "@/pages/user/login.vue";
import ProjectManagement from "@/pages/projectManagement/index.vue";
const ApplicationManagement = () => import('@/pages/applicationManagement/index.vue');
const ModulesManagement = () => import('@/pages/modulesManagement/index.vue');
const TemplateManagement = () => import('@/pages/templateManagement/index.vue');
const MessageRecord = () => import('@/pages/messageRecord/index.vue');

const routes = [
  { path: '/', component: Login },
  { path: '/login', component: Login },
  { 
    path: '/workbench',
    component: Workbench,
    children: [
      {
        path: 'project-management',
        component: ProjectManagement,
        name: '项目管理'
      },
      {
        path: 'application-management',
        component: ApplicationManagement,
        name: '应用管理'
      },
      {
        path: 'modules-management',
        component: ModulesManagement,
        name: '模块管理'
      },
      {
        path: 'template-management',
        component: TemplateManagement,
        name: '模板管理'
      },
      {
        path: 'message-record',
        component: MessageRecord,
        name: '消息记录'
      },
    ]
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes, 
})