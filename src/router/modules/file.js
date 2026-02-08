import Layout from '@/layout'

const fileRouter = {
  path: '/file',
  component: Layout,
  redirect: '/file/list',
  name: 'File',
  meta: { title: 'File Management', icon: 'nested' },
  children: [
    {
      path: 'list',
      name: 'FileList',
      component: () => import('@/views/file/index'),
      meta: { title: 'File List' }
    }
  ]
}
export default fileRouter
