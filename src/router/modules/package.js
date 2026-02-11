import Layout from '@/layout'

const packageRouter = {
  path: '/package',
  component: Layout,
  redirect: '/package/list',
  name: 'Package',
  meta: { title: 'Package Management', icon: 'package' },
  children: [
    {
      path: 'list',
      name: 'PackageList',
      component: () => import('@/views/package/index'),
      meta: { title: 'Package List' }
    }
  ]
}
export default packageRouter
