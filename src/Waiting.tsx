import { Progress } from "antd"
import { useContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { CurrentTasksContext, useTasks } from "./hooks"
import IProps from "./IProos"
import { State } from "./store"

export default function Waiting({client}: IProps) {
  let selectedGids = useSelector((state: State) => {
    return state.selectedTasksGid
  })
  // let tasks = useSelector((state: State) => {
  //   return state.waitingTasks
  // })
  let dispatch = useDispatch()
  let {setCurrentTasks, setTasksType, setIsSetting, taskOrder} = useContext(CurrentTasksContext)

  useEffect(() => {
    dispatch({
      type: 'selectTask',
      tasks: [] 
    })
    setTasksType('waiting')
    setIsSetting(false)
  }, [dispatch, setTasksType, setIsSetting])

  let tasks: any[] = useTasks(async() => {
    await client.ready()
    // @ts-ignore
    return client.tellWaiting(0, 100).then(tasks => {
      setCurrentTasks(tasks)
      if (taskOrder) {
        return tasks
      } else {
        tasks.sort((a: any, b: any) => {
          return a.files[0].path.split('/').pop()[0].charCodeAt() - b.files[0].path.split('/').pop()[0].charCodeAt()
        })
        return tasks
      }
    })
  }, 1000, client)

  // useEffect(() => {
  //   let id = setInterval(() => {
  //     // @ts-ignore
  //     client?.tellWaiting(0, 100).then(tasks => {
  //       dispatch({
  //         type: 'updataWaitingTasks',
  //         tasks: tasks
  //       })
  //     })
  //   }, 1000)
    
  //   return () => {
  //     clearInterval(id)
  //   }
  // }, [client, dispatch])

  

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
            <div style={{width: '10%', paddingLeft: '10px', paddingRight: '10px'}}>已暂停</div>
            <Link style={{lineHeight: '47px'}} to={'/task/detail/' + task.gid}>详情</Link>
          </li>
        })
      }
    </ul>
  </div>
}