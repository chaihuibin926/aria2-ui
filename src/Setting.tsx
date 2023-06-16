import { Button, Input, Select } from "antd";
import { memo, useContext, useEffect, useState } from "react";
import { CurrentTasksContext, useInput } from "./hooks";
import IProps from "./IProos";
import {ToastContainer, toast} from 'react-toastify'
let {Option} = Select


function Setting({client}: IProps) {
  let [options, setOptions] = useState<any>(null)
  let { setIsSetting, setTasksType, setAddUriOption } = useContext(CurrentTasksContext)
  let dir = useInput()
  let downloadSpeed = useInput()
  let maxDown = useInput()
  let log = useInput()
  let integrity = useInput()
  let continue1 = useInput()

  useEffect(() => {
    setIsSetting(true)
    setTasksType('')
  }, [setTasksType, setIsSetting])

  useEffect(() => {
    if(client) {
      // @ts-ignore
      client.getGlobalOption().then(options => {
        setOptions(options)
      })
    } else {
      setOptions(null)
    }
  }, [client])

  function save(e: any) {
    let globalOption1: {
      [key: string]: any
    } = {
      'dir': dir.bind.value,
      'max-download-limit': downloadSpeed.bind.value,
      'check-integrity': integrity.bind.value,
      'continue': continue1.bind.value
    }
    for (let key in globalOption1) {
      if (globalOption1[key]) {
        if (globalOption1[key] === '是') {
          globalOption1[key] = true
        } else if (globalOption1[key] === '否') {
          globalOption1[key] = false
        }
      } else {
        delete globalOption1[key]
      }
    }
    let globalOption2: {
      [key: string]: any
    } = {
      'max-concurrent-downloads': maxDown.bind.value,
      'log': log.bind.value
    }
    for (let key in globalOption2) {
      if (!globalOption2[key]) {
        delete globalOption2[key] 
      }
    }

    setAddUriOption(globalOption1)
    // @ts-ignore
    client?.changeGlobalOption(globalOption2)
    // @ts-ignore
    client?.changeGlobalOption(globalOption1).then(() => toast('保存成功'))
  }

  return (
    <div>
      <ToastContainer></ToastContainer>
      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderBottom: '1px dotted #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>下载路径(dir)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Input spellCheck='false' placeholder={options && options.dir} {...dir.bind}></Input>
        </div>
      </div>

      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#FFFFFF', borderBottom: '1px dotted #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>最大下载速度(max-download-limit)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Input spellCheck='false' {...downloadSpeed.bind} placeholder={options && options['max-download-limit']} addonAfter='字节'></Input>
        </div>
      </div>

      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderBottom: '1px dotted #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>最大同时下载数量(max-concurrent-downloads)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Input spellCheck='false' {...maxDown.bind} placeholder={options && options['max-concurrent-downloads']}></Input>
        </div>
      </div>

      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#FFFFFF', borderBottom: '1px dotted #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>日志文件(log)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Input spellCheck='false' {...log.bind} placeholder={options && options['log']}></Input>
        </div>
      </div>

      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderBottom: '1px dotted #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>检查完整性(check-integrity)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Select style={{width: '100%'}} {...integrity.bind} placeholder={options && (options['check-integrity'] === 'false' ? '否' : '是')}>
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        </div>
      </div>

      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderBottom: '1px dotted #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>断点续传(continue)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Select style={{width: '100%'}} {...continue1.bind} placeholder={options && (options['continue'] === 'false' ? '否' : '是')}>
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        </div>
      </div>

      <Button style={{margin: '10px'}} type="primary" onClick={save}>保存</Button>


      {/* <h2>设置</h2>
      {options &&
        Object.entries(options).map(([key, val]: any[]) => {
          return <div key={key}>
            <span>{key}</span>
            {val === 'true' || val === 'false'
              ? <input type="checkbox" checked={val === 'true'} onChange={(e) => setOneOption(e, key)}/>
              : <input type="text" value={val} onChange={(e) => setOneOption(e, key)}/>
            }
          </div>
        })
      }
      {options &&
        <button onClick={save}>保存</button>
      } */}
    </div>
  )
}

export default memo(Setting)