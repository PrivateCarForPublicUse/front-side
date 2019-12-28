import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import constant from "vue-amap/src/lib/utils/constant";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/myreimbursement',
    component: Layout,
    redirect: '/myreimbursement',
    children: [{
      path: 'index',
      name: 'Myreimbursement',
      component: () => import('@/views/myreimbursement/index'),
      meta: { title: '我的报销', icon: 'dashboard' }
    }]
  },
  {
    path: '/myroute',
    component: Layout,
    redirect: '/myroute',
    children: [{
      path: 'index',
      name: 'Myroute',
      component: () => import('@/views/myroute/index'),
      meta: { title: '我的行程', icon: 'dashboard' }
    }]
  },
  {
    path: '/publiccar',
    component: Layout,
    redirect: '/publiccar',
    children: [{
      path: 'index',
      name: 'Publiccar',
      component: () => import('@/views/publiccar/index'),
      meta: { title: '共有车库', icon: 'dashboard' }
    }]
  },
  {
    path: '/mycar',
    component: Layout,
    redirect: '/mycar/carinfo',
    name: 'mycar',
    meta: { title: '我的车辆', icon: 'dashboard' },
    children: [{
      path: 'carinfo',
      name: 'Carinfo',
      component: () => import('@/views/mycar/carinfo/index'),
      meta: { title: '车辆信息', icon: 'dashboard' }
    }, {
      path: 'carroute',
      name: 'Carroute',
      component: () => import('@/views/mycar/carroute/index'),
      meta: { title: '车辆行程', icon: 'dashboard' }
    }
    ]
  },
  {
    path: '/contact',
    component: Layout,
    redirect: '/contact',
    children: [{
      path: 'index',
      name: 'contact',
      component: () => import('@/views/contact/index'),
      meta: { title: '企业通讯录', icon: 'dashboard' }
    }]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  }
]

// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    meta: { title: '权限测试', icon: 'dashboard' },
    name: '权限测试',
    children: [
      {
        path: 'index',
        component: () => import('@/views/permissiontest/index'),
        name: '管理员可见',
        meta: { roles: [0, 1], title: '管理员可见', icon: 'dashboard' } // 页面需要的权限
      },
      {
        path: 'external-link',
        name: '所有人可见',
        component: Layout,
        children: [
          {
            path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
            meta: { title: '所有人可见', icon: 'link' }
          }
        ]
      }
    ]
  },
  {
    path: '/master/user',
    name: '用户管理',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/master/user/index'),
        meta: { title: '用户管理', icon: 'dashboard', roles: [0, 1] }
      }
    ]
  },
  {
    path: '/master/car',
    name: '车辆管理',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/master/car/index'),
        meta: { title: '车辆管理', icon: 'dashboard', roles: [0, 1] }
      }
    ]
  },
  {
    path: '/master/route',
    name: '路程管理',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/master/route/index'),
        meta: { title: '路程管理', icon: 'dashboard', roles: [0, 1] }
      }
    ]
  },
  {
    path: '/master/master',
    name: '管理员管理',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/master/master/index'),
        meta: { title: '管理员管理', icon: 'dashboard', roles: [1] }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.options.routes = constantRoutes
  router.matcher = newRouter.matcher // reset router
}

export default router
