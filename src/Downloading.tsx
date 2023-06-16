import IProps from "./IProos"
import { useDispatch, useSelector } from "react-redux"
import { State } from "./store"
import { useContext, useEffect } from "react"
import { Progress } from "antd"
import { Link } from "react-router-dom"
import { CurrentTasksContext } from "./hooks"



export default function Downloading({ client }: IProps) {
  let {setCurrentTasks, setTasksType, setIsSetting} = useContext(CurrentTasksContext)
  let dispatch = useDispatch()
  let tasks = useSelector((state: State) => {
    return state.activeTasks
  })
  let selectedGids = useSelector((state: State) => {
    return state.selectedTasksGid
  })

  useEffect(() => {
    dispatch({
      type: 'selectTask',
      tasks: [] 
    })
    setTasksType('download')
    setIsSetting(false)
  }, [dispatch, setIsSetting, setTasksType])

  useEffect(() => {
    let id = setInterval(() => {
      // @ts-ignore
      client?.tellActive().then(tasks => {
        dispatch({
          type: 'updateActiveTasks',
          tasks: tasks
        })
        setCurrentTasks(tasks)
      })
    }, 1000)

    return () => {
      clearInterval(id)
    }
  }, [client, dispatch, setCurrentTasks])

  function selectTask(gid: any) {
    let gids
    if (!selectedGids.includes(gid)) {
      gids = [...selectedGids, gid]
    } else {
      gids = selectedGids.filter(it => it !== gid)
    }

    dispatch({
      type: 'selectTask',
      tasks: gids
    })
  }
  
  
  return <div>
    <ul>
      {
        tasks.map(task => {
          return <li className="task" key={task.gid} onClick={() => selectTask(task.gid)}>
            <div style={{width: '45%', paddingLeft: '10px', paddingRight: '10px'}}>
              {selectedGids.includes(task.gid) &&
                <i style={{color: '#00D26A'}} className="fa-solid fa-square-check"></i>
              }
              {' '}
              {task.files[0].path.split('/').pop()}
            </div>
            <div style={{width: '20%', paddingLeft: '10px', paddingRight: '10px'}}>{task.totalLength === '0' ? '' : task.totalLength}</div>
            <div style={{width: '20%', paddingLeft: '10px', paddingRight: '10px'}}>
            <Progress
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              percent={task.totalLength === '0' ? 0 : Number((task.completedLength / task.totalLength).toFixed(3)) * 100}
            />
            </div>
            <div style={{width: '10%', paddingLeft: '10px', paddingRight: '10px'}}>{(task.downloadSpeed / 1024).toFixed(2)}KB/s</div>
            <Link style={{lineHeight: '47px'}} to={'/task/detail/' + task.gid}>详情</Link>
            {/* <span>{task.completedLength / 1024}KB</span>*/}
          </li>
        })
      }
    </ul>
  </div>
}