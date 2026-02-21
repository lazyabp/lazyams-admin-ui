import Layout from '@/layout'

const languageRouter = {
  path: '/language',
  component: Layout,
  redirect: '/language/list',
  name: 'Language',
  meta: { title: 'Language Management', icon: 'language' },
  children: [
    {
      path: 'list',
      name: 'LanguageList',
      component: () => import('@/views/language/index'),
      meta: { title: 'Language List' }
    }
  ]
}
export default languageRouter
