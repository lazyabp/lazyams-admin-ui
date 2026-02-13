import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order/list',
  name: 'Order',
  meta: { title: 'Order Management', icon: 'shopping' },
  children: [
    {
      path: 'list',
      name: 'OrderList',
      component: () => import('@/views/order/index'),
      meta: { title: 'Order List' }
    }
  ]
}
export default orderRouter
