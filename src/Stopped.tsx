import { Progress } from "antd"
import React, { forwardRef, memo, useContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { CurrentTasksContext, useTasks } from "./hooks"
import IProps from "./IProos"
import { State } from "./store"


function Stopped({client}: IProps, ref: React.Ref<any>) {
  let dispatch = useDispatch()
  // let tasks = useSelector((state: State) => {
  //   return state.stoppedTasks
  // })
  let selectedGids = useSelector((state: State) => {
    return state.selectedTasksGid
  })
  let {setCurrentTasks, setTasksType, setIsSetting, taskOrder} = useContext(CurrentTasksContext)

  useEffect(() => {
    dispatch({
      type: 'selectTask',
      tasks: [] 
    })
    setTasksType('stopped')
    setIsSetting(false)
  }, [dispatch, setTasksType, setIsSetting])

  // useEffect(() => {
  //   let id = setInterval(() => {
  //     // @ts-ignore
  //     client?.tellStopped(0, 100).then(tasks => {
  //       dispatch({
  //         type: 'updataStoppedTasks',
  //         tasks: tasks
  //       })
  //     })
  //   }, 1000)

  //   return () => {
  //     clearInterval(id)
  //   }
  // }, [client, dispatch])

  let tasks = useTasks(async () => {
    if (!client) {
      return []
    }
    await client.ready()
    // @ts-ignore
    return client.tellStopped(0, 100).then(tasks => {
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

  // tasksRef.current = useTasks(async () => {
  //   if (!client) {
  //     return []
  //   }
  //   await client.ready()
  //   // @ts-ignore
  //   return client.tellStopped(0, 100)
  // }, 1000, client)

  // useImperativeHandle(ref, () => {
  //   return {
  //     selectAll() {
  //       dispatch({
  //         type: 'selectTask',
  //         tasks: tasks.map((it: any) => it.gid)
  //       })
  //       // setSelectedGids(tasksRef.current.map((it: any) => it.gid))
  //     },
  //     // getSelectedTask() {
  //     //   return selectedGids.map(gid => {
  //     //     return tasks.find(task => task.gid === gid)
  //     //   }).filter(it => it)
  //     // },
  //     onSelectedTaskChanged: null
  //   }
  // }, [])

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
    // setSelectedGids(gids)
    // if (typeof ref == 'object') {
    //   ref?.current?.onSelectedTaskChanged?.(
    //     gids.map(gid => {
    //       return tasks.find((task: any) => task.gid === gid)
    //     }).filter(it => it)
    //   )
    // }
  }


  return <div>
    <ul>
      {
        tasks.map((task: any) => {
          return <li className="task" key={task.gid} onClick={() => selectTask(task.gid)}>
            <div style={{width: '45%', paddingLeft: '10px', paddingRight: '10px'}}>
              {selectedGids.includes(task.gid) &&
                <i style={{color: '#00D26A'}} className="fa-solid fa-square-check"></i>
              }
              {' '}
              {task.files[0].path.split('/').pop()}
            </div>
            <div style={{width: '20%', paddingLeft: '10px', paddingRight: '10px'}}>{task.totalLength === '0' ? '' : (task.totalLength / 1024).toFixed(2) + 'KB'}</div>
            <div style={{width: '20%', paddingLeft: '10px', paddingRight: '10px'}}>
            <Progress
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              percent={task.totalLength === '0' ? 0 : Number((task.completedLength / task.totalLength).toFixed(3)) * 100}
            />
            </div>
            <div style={{width: '10%', paddingLeft: '10px', paddingRight: '10px'}}></div>
            <Link style={{lineHeight: '47px'}} to={'/task/detail/' + task.gid}>详情</Link>
          </li>
        })
      }
    </ul>
  </div>
}

export default memo(forwardRef(Stopped))