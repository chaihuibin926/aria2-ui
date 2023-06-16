import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Block from "./Block";
import Files from "./Files";
import { CurrentTasksContext, useAsync } from "./hooks";
import IProps from "./IProos";
import Overview from "./Overview";


export default function TaskDetail({client}: IProps) {
  let params = useParams()
  let [showPage, setShowPage] = useState('总览')
  let {pending, value: task, error} = useAsync(useCallback(async () => {
    // @ts-ignore
    let task = await client.tellStatus(params.gid)
    console.log(task)
    return task
  }, [client, params.gid]))
  let {setIsSetting, setTasksType} = useContext(CurrentTasksContext)

  useEffect(() => {
    setIsSetting(true)
    setTasksType('')
  }, [setTasksType, setIsSetting])

  let shows: {
    [key: string]: any
  } = {
    总览: <Overview info={task}/>,
    区块信息: <Block info={task}/>,
    文件列表: <Files info={task}/>,
  }

  if (task) {
    return <div>
      <div style={{display: 'flex', alignItems: 'center', borderBottom: '1px dotted #ddd'}}>
        <div onClick={() => setShowPage('总览')} className={"newTaskPage" + (showPage === '总览' ? ' checkedPage' : '')} style={{width: '58px', height: '40px', lineHeight: '40px', textAlign: "center"}}>总览</div>
        <div onClick={() => setShowPage('区块信息')} className={"newTaskPage" + (showPage === '区块信息' ? ' checkedPage' : '')} style={{width: '95px', height: '40px', lineHeight: '40px', textAlign: "center"}}>区块信息</div>
        <div onClick={() => setShowPage('文件列表')} className={"newTaskPage" + (showPage === '文件列表' ? ' checkedPage' : '')} style={{width: '95px', height: '40px', lineHeight: '40px', textAlign: "center"}}>文件列表</div>
      </div>

      {/* <div onClick={() => setShow('overview')}>总览</div>
      <div onClick={() => setShow('block')}>区块信息</div>
      <div onClick={() => setShow('files')}>文件列表</div>
      <div>---------------------</div> */}
      {
        shows[showPage]
      }
    </div>
  }
  if (error) {
    return <div>
      {'error'}
    </div>
  }
  if (pending) {
    return <div>
      {'loadding...'}
    </div>
  }
  return null
}