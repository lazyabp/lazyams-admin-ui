import * as signalR from '@microsoft/signalr'
import store from '@/store'

export default {
  SR: null,

  start(url, callFunc) {
    const token = store.getters && store.getters.token
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.VUE_APP_BASE_API}/${url}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        accessTokenFactory: () => {
          return `${token}`
        },
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        // Try adding this if you don't need cookies:
        httpClient: new signalR.DefaultHttpClient(signalR.LogLevel.Error)
      })
      .withAutomaticReconnect(new ReconnectPolicy()) // 开启自动重连机制
      .configureLogging(signalR.LogLevel.Error) // 配置日志级别为Error
      .build()

    // 保存连接对象到SR属性
    this.SR = connection

    // 监听连接关闭事件
    connection.onclose((error) => {
      console.log('hub连接断开:' + error)
    })
    // 监听重连事件
    connection.onreconnecting((error) => {
      console.log('正在尝试重新连接...', error)
    })
    // 监听重连成功事件
    connection.onreconnected((connectionId) => {
      console.log('hub重新连接成功,新的连接id:' + connectionId)
    })
    // 调用传入的回调函数，并将连接对象作为参数传递
    if (typeof callFunc === 'function') {
      callFunc(connection)
    }

    connection
      .start()
      .then(() => {
        console.log('SignalR 连接成功')
      })
      .catch((error) => {
        console.log('启动 SignalR 连接时出错:', error)
      })
  }
}

class ReconnectPolicy {
  nextRetryDelayInMilliseconds(retryContext) {
    // 每次重连间隔都设置为 3000 毫秒
    return 3000
  }
}
