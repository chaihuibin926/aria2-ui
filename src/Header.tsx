import { Popconfirm } from "antd"
import { useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { CurrentTasksContext } from "./hooks"
import { State } from "./store"

interface IProos {
  listComp: any,
  client: any
}

export default function Header({listComp, client}: IProos) {
  let navigate = useNavigate()
  // let [selectedTasks, setSelectedTasks] = useState([])
  let selectedGids = useSelector((state: State) => {
    return state.selectedTasksGid
  })
  let {currentTasks, tasksType, setTaskOrder} = useContext(CurrentTasksContext)

  // let href = useLocation()
  // let tasks = useTasks(async () => {
  //   if (!client) {
  //     return []
  //   }
  //   await client.ready()
  //   // @ts-ignore
  //   if (href.pathname === '/stopped') {
  //     return client?.tellStopped(0, 100)
  //   } else if (href.pathname === '/downloading') {
  //     return client?.tellActived()
  //   } else if (href.pathname === '/waiting') {
  //     return client?.tellWaiting(0, 100)
  //   }
  // }, 1000, client)

  

  let dispatch = useDispatch()

  // useEffect(() => {
  //   if (listComp.current) {
  //     listComp.current.onSelectedTaskChanged = function (tasks: any) {
  //       setSelectedTasks(tasks)
  //     }
  //   }
  //   // let current = listComp.current
  //   // return () => {
  //   //   if (current) {
  //   //     current.onSelectedTaskChanged = null
  //   //   }
  //   // }
  // }, [listComp])

  function goNew() {
    navigate('new-task')
  }

  function selectAll() {
    if (selectedGids.length < currentTasks.length) {
      dispatch({
        type: 'selectTask',
        tasks: currentTasks.map(task => task.gid)
      })
    } else {
      dispatch({
        type: 'selectTask',
        tasks: []
      })
    }
  }

  function isHover(is: Boolean) {
    if (selectedGids.length) {
      if (!is) {
        return ''
      }
    } else {
      return ''
    }
    return ' hover'
  }

  function pauseTasks() {
    if (tasksType === 'download' && selectedGids.length) {
      selectedGids.forEach(gid => {
        client.forcePause(gid)
      })
      navigate('/waiting')
    }
  }

  function unpauseTasks() {
    if (tasksType === 'waiting' && selectedGids.length) {
      selectedGids.forEach(gid => {
        client.unpause(gid)
      })
      navigate('/downloading')
    }
  }

  function removeTasks() {
    if (selectedGids.length) {
      if (tasksType === 'stopped') {
        selectedGids.forEach(gid => {
          client.removeDownloadResult(gid)
        })
      } else {
        selectedGids.forEach(gid => {
          client.forceRemove(gid)
        })
      }
    }
  }
  const confirm = () => {
    removeTasks()
  };
  
  const cancel = () => {
    
  };

  return (
    <div style={{backgroundColor: '#F6F6F6'}}>
      <div style={{marginLeft: '15px'}} className="action hover" onClick={goNew}><i style={{marginRight: '5px'}} className="fa-solid fa-plus"></i>新建</div>
      <div style={{borderLeft: '1px solid rgb(163 159 159)', height: '20px', marginLeft: '15px', marginRight: '15px'}}></div>
      <div title="开始任务" className={"action" + isHover(tasksType === 'waiting')} onClick={unpauseTasks}><i className="fa-solid fa-play"></i></div>
      <div title="暂停任务" className={"action" + isHover(tasksType === 'download')} onClick={pauseTasks}><i style={{fontSize: '19px'}} className="fa-solid fa-pause"></i></div>
      {selectedGids.length && tasksType
      ? <Popconfirm
          title="确定要删除吗?"
          onConfirm={confirm}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <div title="删除任务" className={"action" + isHover(selectedGids.length !== 0)}><i className="fa-solid fa-trash-can"></i></div>
        </Popconfirm>
      : <div title="删除任务" className={"action"}><i className="fa-solid fa-trash-can"></i></div>

      }
      <div style={{borderLeft: '1px solid rgb(163 159 159)', height: '20px', marginRight: '15px'}}></div>
      <div title="全部选中" className="action hover" onClick={selectAll}><i className="fa-solid fa-border-all"></i></div>
      <div title="显示顺序" className="action hover" onClick={() => setTaskOrder((order: Boolean) => !order)}><i className="fa-solid fa-arrow-down-a-z"></i></div>
      
      {/* <button onClick={goNew}>新建下载</button>
      <button hidden={selectedTasks.length === 0}>删除任务</button>
      <button >清除已完成任务</button>
      <button onClick={selectAll}>全选</button> */}
    </div>
  )
}