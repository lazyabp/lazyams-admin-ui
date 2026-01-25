import Layout from '@/layout'

const settingRouter = {
  path: '/setting',
  component: Layout,
  redirect: '/setting/index',
  name: 'Setting',
  meta: { title: 'Setting Management', icon: 'el-icon-setting' },
  children: [
    {
      path: 'index',
      name: 'SettingList',
      component: () => import('@/views/setting/index'),
      meta: { title: 'Setting List' }
    }
  ]
}

export default settingRouter
