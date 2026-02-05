/**
 * 将菜单数据转换为Vue Router格式
 * @param {Array} menuList - 菜单列表
 * @returns {Array} 路由数组
 */
export function menuListToRoutes(menuList) {
  if (!menuList || !Array.isArray(menuList)) {
    return []
  }

  return menuList.map(menuItem => {
    // 过滤掉menuType为3的菜单项（按钮类型）
    if (menuItem.menuType === 3) {
      return null
    }

    // 构建路由对象
    const route = {
      path: menuItem.route || `/${menuItem.id}`, // 如果没有路由则使用ID作为默认路径
      component: loadView(menuItem.component),
      name: menuItem.name,
      meta: {
        title: menuItem.description || menuItem.name,
        permission: menuItem.permission,
        icon: menuItem.icon || 'el-icon-menu',
        menuId: menuItem.id // 存储菜单ID用于后续操作
      }
    }

    // 如果有子菜单，则递归处理
    if (menuItem.children && menuItem.children.length > 0) {
      const children = menuListToRoutes(menuItem.children)
      if (children.length > 0) {
        route.children = children
      }
    }

    return route
  }).filter(Boolean) // 过滤掉null值
}

/**
 * 动态加载视图组件
 * @param {String} viewPath - 视图路径
 * @returns {Function} 异步导入函数
 */
export function loadView(viewPath) {
  if (!viewPath) {
    // 如果没有指定组件路径，返回Layout组件或默认空白页面
    return () => import('@/layout')
  }

  // 如果是外部链接，返回iframe页面
  if (isExternal(viewPath)) {
    return () => import('@/views/iframe/index')
  }

  // 处理相对路径
  if (viewPath.startsWith('/')) {
    viewPath = viewPath.substring(1)
  }

  if (viewPath.startsWith('views/')) {
    viewPath = viewPath.substring(6)
  }

  // 返回异步导入函数
  return resolve => require([`@/views/${viewPath}`], resolve).catch(err => {
    console.error(`无法加载组件: @/views/${viewPath}.vue`, err)
    return import('@/views/error-page/404')
  })
}

/**
 * 检查是否为外部链接
 * @param {String} path - 路径
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
