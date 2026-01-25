import Layout from '@/layout'

const configRouter = {
  path: '/config',
  component: Layout,
  redirect: '/config/index',
  name: 'Config',
  meta: { title: 'Config Management', icon: 'el-icon-config' },
  children: [
    {
      path: 'index',
      name: 'ConfigList',
      component: () => import('@/views/config/index'),
      meta: { title: 'Config List' }
    }
  ]
}

export default configRouter
