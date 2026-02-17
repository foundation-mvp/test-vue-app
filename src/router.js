import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import FilesPage from './views/FilesPage.vue'
import TodosPage from './views/TodosPage.vue'
import WebSocketPage from './views/WebSocketPage.vue'
import AccountPage from './views/AccountPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/files',
    name: 'files',
    component: FilesPage
  },
  {
    path: '/todos',
    name: 'todos',
    component: TodosPage
  },
  {
    path: '/websocket',
    name: 'websocket',
    component: WebSocketPage
  },
  {
    path: '/account',
    name: 'account',
    component: AccountPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
