import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import Aria2Client from './aria2-client';
import Downloading from './Downloading';
import Header from './Header';
import NewTask from './NewTask';
import Stopped from './Stopped';
import TaskDetail from './TaskDetail';
import Waiting from './Waiting';
import Setting from './Setting';
import Servers from './Servers';
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'antd/dist/antd.css';
import './App.css';
import { CurrentTasksContext } from "./hooks"


function App() {
  let [currentServerIdx, setCurrentServerIdx] = useState(useMemo(() => localStorage.currentServerIdx, []))
  let [connectState, setConnectState] = useState('未连接')
  
  let [globalStat, setGlobalStat] = useState<any>({})
  let aria2Servers = useMemo(() => {
    if (!localStorage.ARIA2_SERVERS) {
      localStorage.ARIA2_SERVERS = '[]'
    }
    return JSON.parse(localStorage.ARIA2_SERVERS)
  }, [])

  
  let [servers, setServer] = useState(aria2Servers)
  let currentServer = servers[currentServerIdx]
  if (servers[currentServerIdx] === undefined) {
    localStorage.currentServerIdx = ''
  }
  useEffect(() => {
    setGlobalStat({})
  }, [currentServer])

  let [openSelectServer, setOpenSelectServer] = useState(false)

  let [aria2, setAria2] = useState<any>()

  useEffect(() => {
    let id: NodeJS.Timer
    
    if (currentServer) {
      let aria2 = new Aria2Client(currentServer.ip, currentServer.port, currentServer.secret)
      setAria2(aria2)
      setConnectState('连接中')
      aria2.ready().then(() => {
        setConnectState(connState => {
          if (connState === '连接中') {
            return '连接成功'
          } else {
            return connState
          }
        })
      }, () => {
        setConnectState(connState => {
          if (connState === '连接中') {
            return '连接失败'
          } else {
            return connState
          }
        })
      })

      aria2.ready().then(() => {
        id = setInterval(() => {
          // @ts-ignore
          aria2.getGlobalStat().then(stat => {
            setGlobalStat(stat)
          })
        }, 1000)
      })
      
      let onComplete = async function(taskInfo: any) {
        // @ts-ignore
        let task = await aria2.tellStatus(taskInfo.gid)
        toast(`${task.files[0].path.split('/').pop()}下载完成了`)
      }
      aria2.on('DownloadComplete', onComplete)
    }

    return () => {
      clearInterval(id)
      if (aria2) {
        aria2.destroy()
      }
    }
  }, [currentServer])

  let listComp = useRef()

  function changeServer(idx: any) {
    if (idx !== '默认') {
      let server = servers[idx]
      setAria2(new Aria2Client(server.ip, server.port, server.secret))
    } else {
      setAria2(null)
      setGlobalStat({})
      setConnectState('未连接')
    }
    localStorage.currentServerIdx = idx
    setCurrentServerIdx(Number(idx))
    setOpenSelectServer(false)
  }
  function clickOther(e: any) {
    let noOther1 = document.querySelector('.serverSelected span')
    let noOther2 = document.querySelector('.serverSelected ul')
    if (e.target !== noOther1 && e.target !==noOther2) {
      setOpenSelectServer(false)
    }
  }
  let [currentTasks, setCurrentTasks] = useState<any[]>([])
  let [tasksType, setTasksType] = useState<any>('')
  let [isSetting, setIsSetting] = useState<any>(false)
  let [addUriOption, setAddUriOption] = useState<any>({})
  let [taskOrder, setTaskOrder] =useState(true)
  
  return (
    <HashRouter>
      <ToastContainer />
      <CurrentTasksContext.Provider value={
        {
         currentTasks,
         setCurrentTasks,
         tasksType,
         setTasksType,
         isSetting,
         setIsSetting,
         addUriOption,
         setAddUriOption,
         taskOrder,
         setTaskOrder
        }
      }>
        <div className="App" onClick={clickOther}>
          <div className='App-left'>
            <div className='serverSelected'>
              <span onClick={() => setOpenSelectServer(open => !open)}>
                Aria2
                <span style={{fontSize: '12px', marginLeft: '5px'}}><i className="fa-solid fa-caret-down"></i></span>
              </span>
              <ul style={{display: `${openSelectServer ? 'block' : 'none'}`}}>
                <li style={{listStyle: 'none'}} onClick={() => changeServer('默认')}>
                  <span style={{color: '#777', lineHeight: '20px', fontSize: '16px'}}>
                    选择服务器
                  </span>
                </li>
                {
                  servers.map((server: any, idx: number) => {
                    return <li style={{listStyle: 'none'}} key={server.ip + server.port} onClick={() => changeServer(idx)}>
                      <span style={{color: '#777', lineHeight: '20px', fontSize: '16px'}}>{server.ip + ':' + server.port}</span>
                      <span style={{float: 'right'}}>{Number(currentServerIdx) === idx ? '✅'  : ''}</span>
                    </li>
                  })
                }
              </ul>
            </div>
            <div className='connectState'><span>{connectState}</span></div>
            <NavLink style={({isActive}) => ({color: isActive ? '#5399e8' : '#a2b5b9', backgroundColor: isActive ? '#252C30' : ''})} to="downloading"><i className="fa-solid fa-circle-arrow-down"></i>正在下载({globalStat.numActive ?? '0'})</NavLink>
            <NavLink style={({isActive}) => ({color: isActive ? '#5399e8' : '#a2b5b9', backgroundColor: isActive ? '#252C30' : ''})} to="waiting"><i className="fa-solid fa-clock"></i>等待下载({globalStat.numWaiting ?? '0'})</NavLink>
            <NavLink style={({isActive}) => ({color: isActive ? '#5399e8' : '#a2b5b9', backgroundColor: isActive ? '#252C30' : ''})} to="stopped"><i className="fa-solid fa-circle-check"></i>完成下载({globalStat.numStopped ?? '0'})</NavLink>
            <div className='setting'>系统设置</div>
            <NavLink style={({isActive}) => ({color: isActive ? '#5399e8' : '#a2b5b9', backgroundColor: isActive ? '#252C30' : ''})} to="setting"><i className="fa-solid fa-gear"></i>设置</NavLink>
            <NavLink style={({isActive}) => ({color: isActive ? '#5399e8' : '#a2b5b9', backgroundColor: isActive ? '#252C30' : ''})} to="servers"><i className="fa-solid fa-server"></i>Aria2管理</NavLink>
            <div className='speed'>速度</div>
            <div className='upload'><i style={{color: '#74A329'}} className="fa-solid fa-upload"></i>上传: {((globalStat.uploadSpeed ?? '0') / 1024).toFixed(2)}{' '}B/s</div>
            <div className='download'><i style={{color: '#3A89E9'}} className="fa-solid fa-download"></i>下载: {((globalStat.downloadSpeed ?? '0') / 1024).toFixed(2)}{' '}B/s</div>
          </div>
          <div className='App-right'>
            <div className="App-header">
              <Header client={aria2} listComp={listComp}></Header>
            </div>
            <div className='App-body'>
              {!isSetting &&
                <div style={{fontSize: '12px', display: 'flex', padding: '5px', userSelect: 'none', borderBottom: '1px solid #ddd'}} className='fileInfo'>
                  <div style={{width: '45%', paddingLeft: '10px', paddingRight: '10px'}}>文件名</div>
                  <div style={{width: '20%', paddingLeft: '10px', paddingRight: '10px'}}>大小</div>
                  <div style={{width: '10%', paddingLeft: '10px', paddingRight: '10px'}}>进度</div>
                  <div style={{width: '10%', paddingLeft: '10px', paddingRight: '10px'}}>剩余时间</div>
                  <div style={{width: '10%', paddingLeft: '10px', paddingRight: '10px'}}>下载速度</div>
                </div>
              }
              <Routes>
                <Route path="/downloading" element={<Downloading client={aria2}/>}></Route>
                <Route path="/waiting" element={<Waiting client={aria2}/>}></Route>
                <Route path="/stopped" element={<Stopped ref={listComp} client={aria2}/>}></Route>
                <Route path="/setting" element={<Setting client={aria2}/>}></Route>
                <Route path="/servers" element={<Servers client={aria2} update={setServer}/>}></Route>
                <Route path="/new-task" element={<NewTask client={aria2}/>}></Route>
                <Route path="/task/detail/:gid" element={<TaskDetail client={aria2}/>}></Route>
              </Routes>
            </div>
          </div>
        </div>
      </CurrentTasksContext.Provider>
    </HashRouter>
  );
}

export default App;
