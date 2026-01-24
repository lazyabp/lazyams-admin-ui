import { getRoles, addRole, updateRole, deleteRole, batchDeleteRoles, getRoleById, getMenuTree, getMenuIdsByRoleId, rolePermission } from '@/api/role'
import request from '@/utils/request'

jest.mock('@/utils/request')

describe('Role API', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('getRoles calls request with correct parameters', async () => {
    const mockParams = { PageIndex: 1, PageSize: 10 }
    request.mockResolvedValue({ data: { items: [], total: 0 } })

    await getRoles(mockParams)

    expect(request).toHaveBeenCalledWith({
      url: '/api/Role/GetByPage',
      method: 'get',
      params: mockParams
    })
  })

  it('addRole calls request with correct parameters', async () => {
    const mockData = { roleName: 'Test Role', roleValue: 'test_role' }
    request.mockResolvedValue({ data: { id: 1, ...mockData } })

    await addRole(mockData)

    expect(request).toHaveBeenCalledWith({
      url: '/api/Role/Add',
      method: 'post',
      data: mockData
    })
  })

  it('updateRole calls request with correct parameters', async () => {
    const mockData = { id: 1, roleName: 'Updated Role', roleValue: 'updated_role' }
    request.mockResolvedValue({ data: mockData })

    await updateRole(mockData)

    expect(request).toHaveBeenCalledWith({
      url: '/api/Role/Update',
      method: 'post',
      data: mockData
    })
  })

  it('deleteRole calls request with correct parameters', async () => {
    const mockId = 1
    request.mockResolvedValue({ data: true })

    await deleteRole(mockId)

    expect(request).toHaveBeenCalledWith({
      url: `/api/Role/Delete/${mockId}`,
      method: 'delete'
    })
  })

  it('batchDeleteRoles calls request with correct parameters', async () => {
    const mockIds = [1, 2, 3]
    request.mockResolvedValue({ data: true })

    await batchDeleteRoles(mockIds)

    expect(request).toHaveBeenCalledWith({
      url: '/api/Role/BatchDelete',
      method: 'delete',
      data: mockIds
    })
  })

  it('getRoleById calls request with correct parameters', async () => {
    const mockId = 1
    request.mockResolvedValue({ data: { id: 1, roleName: 'Test Role' } })

    await getRoleById(mockId)

    expect(request).toHaveBeenCalledWith({
      url: `/api/Role/GetById/${mockId}`,
      method: 'get'
    })
  })

  it('getMenuTree calls request with correct parameters', async () => {
    request.mockResolvedValue({ data: { items: [] } })

    await getMenuTree()

    expect(request).toHaveBeenCalledWith({
      url: '/api/Menu/GetMenuTree',
      method: 'get'
    })
  })

  it('getMenuIdsByRoleId calls request with correct parameters', async () => {
    const mockId = 1
    request.mockResolvedValue({ data: { items: [] } })

    await getMenuIdsByRoleId(mockId)

    expect(request).toHaveBeenCalledWith({
      url: `/api/Menu/GetMenuIdsByRoleId/${mockId}`,
      method: 'get'
    })
  })

  it('rolePermission calls request with correct parameters', async () => {
    const mockData = { roleId: 1, menuIds: [1, 2, 3] }
    request.mockResolvedValue({ data: true })

    await rolePermission(mockData)

    expect(request).toHaveBeenCalledWith({
      url: '/api/Role/RolePermission',
      method: 'post',
      data: mockData
    })
  })
})
