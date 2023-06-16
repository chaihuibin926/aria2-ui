import EventEmitter from "events"

export default class Aria2Client extends EventEmitter {
  ws?: WebSocket
  id: number
  readyPromise: Promise<Aria2Client>
  //该对象记录每个任务id所映射到的回调函数
  callbacks: {
    [id: number]: (data: any) => void
  } = {}

  constructor(public ip: string, public port: number | string, public secret: string) {
    super()
    let url = `ws://${ip}:${port}/jsonrpc`
    this.id = 1
    this.readyPromise = new Promise((resolve, reject) => {
      this.ws = new WebSocket(url)
      this.ws.addEventListener('open', (e) => {
        resolve(this)
      })
      this.ws.addEventListener('error', (e) => {
        reject(this)
      })
    })
    // @ts-ignore
    this.ws.addEventListener('message', (e) => {
      let data = JSON.parse(e.data)
      let id = data.id
      if (id) {
        let callback = this.callbacks[id]
        delete this.callbacks[id]
        callback(data)
      } else {
        //说明是事件， ondownloadstart, ondownloaderror
        console.log(e)
        let eventName = data.method.slice(8)
        this.emit(eventName, ...data.params)
      }
    })
  }

  destroy() {
    this.ws?.close()
  }

  ready() {
    return this.readyPromise
  }
}
// function sendCall(this: Aria2Client, methodName: string, ...args: any) {
//   return new Promise((resolve, reject) => {
//     let id = this.id++

//     this.callbacks[id] = (data) => {
//       if (data.error) {
//         reject(data.result)
//       } else {
//         resolve(data.data)
//       }
//     }

//     this.ws.send(JSON.stringify(
//       {
//         jsonrpc: '2.0',
//         id: id,
//         method: methodName,
//         params: [`token:${this.secret}`, ...args]
//       }
//     ))
//   })
// }

let aria2Methods = [
  "aria2.addUri",
  "aria2.addTorrent",
  "aria2.getPeers",
  "aria2.addMetalink",
  "aria2.remove",
  "aria2.pause",
  "aria2.forcePause",
  "aria2.pauseAll",
  "aria2.forcePauseAll",
  "aria2.unpause",
  "aria2.unpauseAll",
  "aria2.forceRemove",
  "aria2.changePosition",
  "aria2.tellStatus",
  "aria2.getUris",
  "aria2.getFiles",
  "aria2.getServers",
  "aria2.tellActive",
  "aria2.tellWaiting",
  "aria2.tellStopped",
  "aria2.getOption",
  "aria2.changeUri",
  "aria2.changeOption",
  "aria2.getGlobalOption",
  "aria2.changeGlobalOption",
  "aria2.purgeDownloadResult",
  "aria2.removeDownloadResult",
  "aria2.getVersion",
  "aria2.getSessionInfo",
  "aria2.shutdown",
  "aria2.forceShutdown",
  "aria2.getGlobalStat",
  "aria2.saveSession",
  "system.multicall",
  "system.listMethods",
  "system.listNotifications"
]

for (let method of aria2Methods) {
  let [ ,methodName] = method.split('.')
  // @ts-ignore
  Aria2Client.prototype[methodName] = function (...args: any[]) {
    return this.ready().then(client => {
      return new Promise((resolve, reject) => {
        let id = this.id++
    
        this.callbacks[id] = (data) => {
          if (data.error) {
            reject(data.result)
          } else {
            resolve(data.result)
          }
        }
        // @ts-ignore
        this.ws.send(JSON.stringify(
          {
            jsonrpc: '2.0',
            id: id,
            method: method,
            params: [`token:${this.secret}`, ...args]
          }
        ))
      })
    })
  }
}