import Layout from '@/layout'

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/list',
  name: 'User',
  meta: { title: 'User Management', icon: 'user' },
  children: [
    {
      path: 'list',
      name: 'UserList',
      component: () => import('@/views/user/index'),
      meta: { title: 'User List' }
    }
  ]
}
export default userRouter
