import Layout from '@/layout'

const autoJobRouter = {
  path: '/auto-job',
  component: Layout,
  redirect: '/auto-job/list',
  name: 'AutoJob',
  meta: { title: 'Auto Job Management', icon: 'nested' },
  children: [
    {
      path: 'list',
      name: 'AutoJobList',
      component: () => import('@/views/auto-job/index'),
      meta: { title: 'Auto Job List' }
    }
  ]
}
export default autoJobRouter
