import Layout from '@/layout'

const autoJobLogRouter = {
  path: '/auto-job-log',
  component: Layout,
  redirect: '/auto-job-log/list',
  name: 'AutoJobLog',
  meta: { title: 'Auto Job Log Management', icon: 'nested' },
  children: [
    {
      path: 'list',
      name: 'AutoJobLogList',
      component: () => import('@/views/auto-job-log/index'),
      meta: { title: 'Auto Job Log List' }
    }
  ]
}
export default autoJobLogRouter
