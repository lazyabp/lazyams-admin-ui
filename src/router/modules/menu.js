import Layout from '@/layout'

const menuRouter = {
  path: '/menu',
  component: Layout,
  redirect: '/menu/list',
  name: 'Menu',
  meta: { title: 'Menu Management', icon: 'list' },
  children: [
    {
      path: 'list',
      name: 'MenuList',
      component: () => import('@/views/menu/index'),
      meta: { title: 'Menu List' }
    }
  ]
}

export default menuRouter
