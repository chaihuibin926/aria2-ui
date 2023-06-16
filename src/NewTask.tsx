import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentTasksContext, useInput } from "./hooks";
import IProps from "./IProos";
import { Button, Input, Select } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const { Option } = Select;


export default function NewTask({ client }: IProps) {
  let uris = useInput()
  let dir = useInput('')
  let overwrite = useInput()
  let downloadSpeed = useInput()
  let conditional = useInput()
  let allocation = useInput()
  let parameterized = useInput()
  let save = useInput()
  let [options, setOptions] = useState<any>()

  useEffect(() => {
    if(client) {
      // @ts-ignore
      client.getGlobalOption().then(options => {
        setOptions(options)
      })
    }
  }, [client])

  let navigate = useNavigate()

  let {setIsSetting, addUriOption} = useContext(CurrentTasksContext)
  let [showPage, setShowPage] = useState('链接')

  useEffect(() => {
    setIsSetting(true)
  }, [setIsSetting])

  function addTask() {
    // if (torrentFile) {
    //   let reader = new FileReader()
    //   reader.onload= function () {
    //     if (typeof reader.result === 'string') {
    //       let base64Idx = reader.result.indexOf('base64')
    //       let torrentBase64 = reader.result.slice(base64Idx + 7)
    //       // @ts-ignore
    //       client.addTorrent(torrentBase64)
    //     }
    //   }
    //   reader.readAsDataURL(torrentFile)
    // } else {
    let links = uris.bind.value.split('\n').map((it: any) => it.trim()).filter((it: any) => it)
    if (!links.length) {
      return 
    }

    let options: {
      [key: string]: any
    } = {
      'dir': dir.bind.value,
      'allow-overwrite': overwrite.bind.value,
      'max-download-limit': downloadSpeed.bind.value,
      'conditional-get': conditional.bind.value,
      'file-allocation': allocation.bind.value,
      'parameterized-uri': parameterized.bind.value,
      'force-save': save.bind.value
    }
    
    for (let key in options) {
      if (options[key]) {
        if (options[key] === '是') {
          options[key] = true
        } else if (options[key] === '否') {
          options[key] = false
        }
      } else {
        delete options[key]
      }
    }

    for (let link of links) {
      // @ts-ignore
      client.addUri([link], {
        ...addUriOption,
        ...options,
      })
    }
    // }
    navigate('/downloading')
  }

  // let [torrentFile, setTorrentFile] = useState(null)
  // function onBTFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
  //   console.log(e)
  //   setTorrentFile(null)
  // }

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', borderBottom: '1px dotted #ddd'}}>
        <div onClick={() => setShowPage('链接')} className={"newTaskPage" + (showPage === '链接' ? ' checkedPage' : '')} style={{width: '58px', height: '40px', lineHeight: '40px', textAlign: "center"}}>链接</div>
        <div onClick={() => setShowPage('选项')} className={"newTaskPage" + (showPage === '选项' ? ' checkedPage' : '')} style={{width: '58px', height: '40px', lineHeight: '40px', textAlign: "center"}}>选项</div>
        <div style={{borderLeft: '1px solid rgb(163 159 159)', height: '20px', marginRight: '15px', marginLeft: '5px'}}></div>
        <Button onClick={addTask} type={uris.bind.value && "primary"} icon={<DownloadOutlined />}>
          下载
        </Button>
      </div>

      {showPage === '链接'
      ? <div style={{padding: '10px 20px 10px 20px'}}>
          <span>下载链接({uris.bind.value?.split('\n').filter((it: any) => it).length}个链接):</span>
          <TextArea spellCheck='false' {...uris.bind} style={{marginTop: '10px'}} rows={10} placeholder="支持多个URL地址,每个地址占一行." />
        </div>
      : <div>

          <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#FFFFFF', borderBottom: '1px dotted #ddd'}}>
            <div style={{width: '25%', paddingLeft: '15px', minWidth: '260px'}}>下载路径(dir)</div>
            <div style={{width: '100px', flexShrink: '1'}}></div>
            <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
              <Input spellCheck='false' placeholder={options && options.dir} {...dir.bind}></Input>
            </div>
          </div>

          <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderBottom: '1px dotted #ddd'}}>
            <div style={{width: '25%', paddingLeft: '15px', minWidth: '260px'}}>允许覆盖(allow-overwrite)</div>
            <div style={{width: '100px', flexShrink: '1'}}></div>
            <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
            <Select {...overwrite.bind} style={{width: '100%'}} placeholder="否">
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>
            </div>
          </div>

          <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#FFFFFF', borderBottom: '1px dotted #ddd'}}>
            <div style={{width: '25%', paddingLeft: '15px', minWidth: '260px'}}>最大下载速度(max-download-limit)</div>
            <div style={{width: '100px', flexShrink: '1'}}></div>
            <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
              <Input spellCheck='false' {...downloadSpeed.bind} placeholder="0" addonAfter='字节'></Input>
            </div>
          </div>

          <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderBottom: '1px dotted #ddd'}}>
            <div style={{width: '25%', paddingLeft: '15px', minWidth: '260px'}}>条件下载(conditional-get)</div>
            <div style={{width: '100px', flexShrink: '1'}}></div>
            <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
            <Select {...conditional.bind} style={{width: '100%'}} placeholder="否">
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>
            </div>
          </div>

          <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#FFFFFF', borderBottom: '1px dotted #ddd'}}>
            <div style={{width: '25%', paddingLeft: '15px', minWidth: '260px'}}>文件支配方法(file-allocation)</div>
            <div style={{width: '100px', flexShrink: '1'}}></div>
            <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
            <Select {...allocation.bind} style={{width: '100%'}} placeholder="prealloc">
              <Option value="无">无</Option>
              <Option value="prealloc">prealloc</Option>
              <Option value="trunc">trunc</Option>
              <Option value="falloc">falloc</Option>
            </Select>
            </div>
          </div>

          <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderBottom: '1px dotted #ddd'}}>
            <div style={{width: '25%', paddingLeft: '15px', minWidth: '260px'}}>启用参数化URI支持(parameterized-uri)</div>
            <div style={{width: '100px', flexShrink: '1'}}></div>
            <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
            <Select {...parameterized.bind} style={{width: '100%'}} placeholder="否">
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>
            </div>
          </div>

          <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#FFFFFF', borderBottom: '1px dotted #ddd'}}>
            <div style={{width: '25%', paddingLeft: '15px', minWidth: '260px'}}>强制保存(force-save)</div>
            <div style={{width: '100px', flexShrink: '1'}}></div>
            <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
            <Select {...save.bind} style={{width: '100%'}} placeholder="否">
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>
            </div>
          </div>
        </div>
      }

    </div>
  )
      // <div>
      //   选项
      //   <div>下载速度: <input type="text" {...downloadSpeed.bind}/></div>
      // </div>
      // <div>
      //   <div>下载链接:</div>
      //   {/* <div>选择bt种子文件: <input type="file" onChange={onBTFileSelect}/></div> */}
      //   <div>
      //     <textarea name="" id="" cols={80} rows={10} {...uris.bind}></textarea>
      //   </div>
      //   <button onClick={() => addTask()}>添加</button>
      // </div>
}