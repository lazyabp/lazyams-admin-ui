// AutoJob API 测试示例
// 该文件用于验证AutoJob API是否能正常工作

import { getAutoJobs, getAutoJobById, addAutoJob, updateAutoJob, executeAutoJob, deleteAutoJob } from '@/api/auto-job'

// 模拟测试数据
const mockAutoJobData = {
  jobName: '测试任务',
  jobGroupName: '默认组',
  jobStatus: 0, // 暂停
  cronExpression: '0/5 * * * * ?', // 每5秒执行一次
  startAt: new Date().toISOString(),
  endAt: null,
  remark: '这是一个测试任务'
}

console.log('开始测试AutoJob API...')

// 测试获取任务列表
getAutoJobs({ PageIndex: 1, PageSize: 10 })
  .then(response => {
    console.log('获取任务列表成功:', response.data)
  })
  .catch(error => {
    console.error('获取任务列表失败:', error)
  })

// 测试添加任务
addAutoJob(mockAutoJobData)
  .then(response => {
    console.log('添加任务成功:', response.data)

    // 使用新创建的任务ID进行后续测试
    const jobId = response.data.id

    // 测试获取单个任务
    getAutoJobById(jobId)
      .then(response => {
        console.log('获取单个任务成功:', response.data)

        // 更新任务
        const updateData = {
          ...response.data,
          jobName: '更新后的测试任务'
        }

        updateAutoJob(updateData)
          .then(response => {
            console.log('更新任务成功:', response.data)

            // 执行任务（切换状态）
            executeAutoJob({ id: jobId, jobStatus: 1 }) // 启动任务
              .then(response => {
                console.log('执行任务成功:', response.data)

                // 删除任务
                deleteAutoJob(jobId)
                  .then(response => {
                    console.log('删除任务成功:', response.data)
                    console.log('AutoJob API 测试完成')
                  })
                  .catch(error => {
                    console.error('删除任务失败:', error)
                  })
              })
              .catch(error => {
                console.error('执行任务失败:', error)
              })
          })
          .catch(error => {
            console.error('更新任务失败:', error)
          })
      })
      .catch(error => {
        console.error('获取单个任务失败:', error)
      })
  })
  .catch(error => {
    console.error('添加任务失败:', error)
  })
