import Layout from '@/layout'

const userSubscriptionRouter = {
  path: '/user-subscription',
  component: Layout,
  redirect: '/user-subscription/list',
  name: 'UserSubscription',
  meta: { title: 'User Subscription Management', icon: 'form' },
  children: [
    {
      path: 'list',
      name: 'UserSubscriptionList',
      component: () => import('@/views/user-subscription/index'),
      meta: { title: 'User Subscriptions' }
    }
  ]
}
export default userSubscriptionRouter
