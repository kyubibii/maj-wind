import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/maj-winds',
    },
    {
      path: '/maj-winds',
      component: () => import('../views/table/GameTable.vue'),
    },
    {
      path: '/maj-winds/restart',
      component: () => import('../views/mainButtons/NewGame.vue'),
    },
    {
      path: '/maj-winds/winning',
      component: () => import('../views/mainButtons/RonnAndTsumo.vue'),
    },
    {
      path: '/maj-winds/draw',
      component: () => import('../views/mainButtons/EndByDraw.vue'),
    },
    {
      path: '/maj-winds/correction',
      component: () => import('../views/mainButtons/CorrectionOfInfo.vue'),
    },
    {
      path: '/maj-winds/ending',
      component: () => import('../views/mainButtons/EndOfAll.vue'),
    },
  ],
})

export default router
