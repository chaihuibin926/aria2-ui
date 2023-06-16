
import { useContext, useEffect, useMemo, useState } from "react";
import { CurrentTasksContext } from "./hooks";
import IProps from "./IProos";
import ShowServer from "./ShowServer";


export default function Servers({client, update}: IProps) {
  let {setIsSetting, setTasksType} = useContext(CurrentTasksContext)
  let [showServerIdx, setShowServerIdx] = useState(0)
  
  useEffect(() => {
    setIsSetting(true)
    setTasksType('')
  }, [setTasksType, setIsSetting])

  let aria2Servers = useMemo(() => {
    if (!localStorage.ARIA2_SERVERS) {
      localStorage.ARIA2_SERVERS = '[]'
    }
    return JSON.parse(localStorage.ARIA2_SERVERS)
  }, [])
  
  let [servers, setServers] = useState(aria2Servers)
  // localStorage.ARIA2_SERVERS = JSON.stringify(servers) ?? '[]'


  // function addServer() {
  //   if (aria2Servers.includes(ip.bind.value)) {
  //     addFail = 'ip已存在'
  //     return
  //   }
  //   aria2Servers.push({
  //     ip: ip.bind.value,
  //     port: port.bind.value,
  //     secret: secret.bind.value,
  //   })
  //   // @ts-ignore
  //   update(aria2Servers)
  //   setServers(aria2Servers)
  //   ip.clear()
  //   port.clear()
  //   secret.clear()
  //   addFail = ''
  // }

  function toAddServer() {
    setServers([
      ...servers,
      {
        ip: '',
        port: '',
        secret: ''
      }
    ])
    setShowServerIdx(servers.length)
  }

  function checkServer(idx: number) {
    setShowServerIdx(idx)
  }

  return <div>
    <div>
      <ul style={{borderBottom: '1px dotted #ddd', display: 'flex', margin: 0}}>
        {
          servers.map((server: any, idx: number) => {
            return <li className={"server" + (showServerIdx === idx ? ' checkedServer' : '')} onClick={() => checkServer(idx)} key={server.ip}>
              <span style={{lineHeight: '40px'}}>{server.name}</span>
            </li>
          })
        }
        <li className="addButton" onClick={toAddServer}><i className="fa-solid fa-plus"></i></li>
      </ul>
    </div>
    {
      servers.map((server: any, idx: number) => {
        return (
          <div key={server.ip} className={idx === showServerIdx ? '' : 'hide'}>
            <ShowServer server={server}></ShowServer>
          </div>
        )
      })
    }
  </div>
}