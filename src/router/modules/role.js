import Layout from '@/layout'

const roleRouter = {
  path: '/role',
  component: Layout,
  redirect: '/role/list',
  name: 'Role',
  meta: { title: 'Role Management', icon: 'role' },
  children: [
    {
      path: 'list',
      name: 'RoleList',
      component: () => import('@/views/role/index'),
      meta: { title: 'Role List' }
    }
  ]
}

export default roleRouter
