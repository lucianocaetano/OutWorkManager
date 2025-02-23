const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: '/login',
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ],
  },
 {
    path: "/access-denied",
    name: "access-denied",
    component: () => import("src/pages/access-denied.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
