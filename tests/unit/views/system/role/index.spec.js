import { shallowMount } from '@vue/test-utils'
import RoleList from '@/views/system/role/index.vue'
import Pagination from '@/components/Pagination'
import { getRoles, addRole, updateRole, deleteRole, batchDeleteRoles, getMenuTree, getMenuIdsByRoleId, rolePermission } from '@/api/role'

jest.mock('@/api/role')
jest.mock('@/components/Pagination')

describe('RoleList component', () => {
  let wrapper

  beforeEach(() => {
    getRoles.mockResolvedValue({ data: { items: [{ id: 1, roleName: 'Admin', roleValue: 'admin', description: 'Admin Role', status: true }], total: 1 } })
    wrapper = shallowMount(RoleList, {
      stubs: {
        Pagination: Pagination, // Use the actual Pagination component or a stub
        'el-table': true,
        'el-table-column': true,
        'el-button': true,
        'el-dialog': true,
        'el-form': true,
        'el-form-item': true,
        'el-input': true,
        'el-switch': true,
        'el-tree': true
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    wrapper.destroy()
  })

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('fetches roles on created', () => {
    expect(getRoles).toHaveBeenCalled()
    expect(wrapper.vm.listLoading).toBe(false)
    expect(wrapper.vm.list.length).toBe(1)
  })

  it('opens add role dialog when handleCreate is called', async () => {
    wrapper.vm.handleCreate()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.dialogFormVisible).toBe(true)
    expect(wrapper.vm.dialogStatus).toBe('create')
    expect(wrapper.vm.tempRole.id).toBe(undefined)
  })

  it('calls addRole and refreshes list on createData success', async () => {
    addRole.mockResolvedValue({ data: { id: 2, roleName: 'New Role', roleValue: 'new_role', description: 'desc', status: true } })
    wrapper.vm.tempRole = { roleName: 'New Role', roleValue: 'new_role', description: 'desc', status: true }
    wrapper.vm.dialogStatus = 'create'
    // Mock the validate function of the form
    wrapper.vm.$refs.dataForm = { validate: (cb) => cb(true), clearValidate: jest.fn() }

    await wrapper.vm.createData()

    expect(addRole).toHaveBeenCalledWith(wrapper.vm.tempRole)
    expect(getRoles).toHaveBeenCalledTimes(2) // Initial fetch + refresh
    expect(wrapper.vm.dialogFormVisible).toBe(false)
  })

  it('opens edit role dialog when handleUpdate is called', async () => {
    const row = { id: 1, roleName: 'Editor', roleValue: 'editor', description: 'Editor Role', status: true }
    wrapper.vm.handleUpdate(row)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.dialogFormVisible).toBe(true)
    expect(wrapper.vm.dialogStatus).toBe('update')
    expect(wrapper.vm.tempRole).toEqual(row)
  })

  it('calls updateRole and refreshes list on updateData success', async () => {
    updateRole.mockResolvedValue({ data: { id: 1, roleName: 'Updated Admin', roleValue: 'admin', description: 'Updated Admin Role', status: true } })
    wrapper.vm.tempRole = { id: 1, roleName: 'Updated Admin', roleValue: 'admin', description: 'Updated Admin Role', status: true }
    wrapper.vm.dialogStatus = 'update'
    wrapper.vm.$refs.dataForm = { validate: (cb) => cb(true), clearValidate: jest.fn() }

    await wrapper.vm.updateData()

    expect(updateRole).toHaveBeenCalledWith(wrapper.vm.tempRole)
    expect(getRoles).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.dialogFormVisible).toBe(false)
  })

  it('calls deleteRole and refreshes list on handleDelete success', async () => {
    deleteRole.mockResolvedValue({ data: true })
    const row = { id: 1 }
    // Mock $confirm
    wrapper.vm.$confirm = jest.fn(() => Promise.resolve('confirm'))
    wrapper.vm.$message = jest.fn() // Mock $message

    await wrapper.vm.handleDelete(row)

    expect(wrapper.vm.$confirm).toHaveBeenCalled()
    expect(deleteRole).toHaveBeenCalledWith(row.id)
    expect(getRoles).toHaveBeenCalledTimes(2)
  })

  it('calls batchDeleteRoles and refreshes list on handleBatchDelete success', async () => {
    batchDeleteRoles.mockResolvedValue({ data: true })
    wrapper.vm.selectedRoles = [1, 2]
    wrapper.vm.$confirm = jest.fn(() => Promise.resolve('confirm'))
    wrapper.vm.$message = jest.fn() // Mock $message

    await wrapper.vm.handleBatchDelete()

    expect(wrapper.vm.$confirm).toHaveBeenCalled()
    expect(batchDeleteRoles).toHaveBeenCalledWith([1, 2])
    expect(getRoles).toHaveBeenCalledTimes(2)
  })

  it('opens permission dialog and fetches data on handlePermission', async () => {
    getMenuTree.mockResolvedValue({ data: { items: [{ id: 1, title: 'Dashboard', parentId: 0 }] } })
    getMenuIdsByRoleId.mockResolvedValue({ data: { items: [1] } })
    const row = { id: 1, roleName: 'Admin' }
    wrapper.vm.$refs.menuTree = { setCheckedKeys: jest.fn() } // Mock el-tree ref

    await wrapper.vm.handlePermission(row)

    expect(wrapper.vm.dialogPermissionVisible).toBe(true)
    expect(wrapper.vm.currentRoleId).toBe(row.id)
    expect(getMenuTree).toHaveBeenCalled()
    expect(getMenuIdsByRoleId).toHaveBeenCalledWith(row.id)
    expect(wrapper.vm.menuTree.length).toBeGreaterThan(0)
    expect(wrapper.vm.checkedMenuKeys).toEqual([1])
    expect(wrapper.vm.$refs.menuTree.setCheckedKeys).toHaveBeenCalledWith([1])
  })

  it('calls rolePermission on confirmPermission', async () => {
    rolePermission.mockResolvedValue({ data: true })
    wrapper.vm.currentRoleId = 1
    wrapper.vm.$refs.menuTree = {
      getCheckedKeys: jest.fn(() => [1, 2]),
      getHalfCheckedKeys: jest.fn(() => [3])
    }
    wrapper.vm.$notify = jest.fn()

    await wrapper.vm.confirmPermission()

    expect(rolePermission).toHaveBeenCalledWith({ roleId: 1, menuIds: [1, 2, 3] })
    expect(wrapper.vm.dialogPermissionVisible).toBe(false)
    expect(wrapper.vm.$notify).toHaveBeenCalled()
  })
})
