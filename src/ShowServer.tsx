import { Button, Input } from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { useInput } from "./hooks";
import {ToastContainer, toast} from 'react-toastify'


export default function ShowServer({server}: any) {
  let name = useInput(server.name)
  let ip = useInput(server.ip)
  let port = useInput(server.port)
  let secret = useInput(server.secret)

  function save() {
    let servers = JSON.parse(localStorage.ARIA2_SERVERS)
    let repectIp = false
    let serverName: string
    if (name.bind.value === '') {
      serverName = `RPC(${server.ip}:${server.port})`
    } else {
      serverName = name.bind.value
    }
    servers.forEach((server: any, idx: number) => {
      if (server.ip === ip.bind.value) {
        repectIp = true
        servers[idx] = {
          name: serverName,
          ip: ip.bind.value,
          port: port.bind.value,
          secret: secret.bind.value,
        }
      }
    })
    if (repectIp === false) {
      servers.push({
        name: serverName,
        ip: ip.bind.value,
        port: port.bind.value,
        secret: secret.bind.value,
      })
    }
    localStorage.ARIA2_SERVERS = JSON.stringify(servers) ?? '[]'
    toast('保存成功')
  }

  return (
    <div>
      <ToastContainer></ToastContainer>
      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderBottom: '1px dotted #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '107px'}}>Aria2 RPC 别名</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Input spellCheck='false' placeholder={ip.bind.value ? (ip.bind.value + ':' + port.bind.value) : ''} {...name.bind}></Input>
        </div>
      </div>
      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#FFFFFF', borderBottom: '1px dotted #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px'}}>Aria2 RPC 地址</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Input spellCheck='false' addonBefore='ws://' addonAfter=':' {...ip.bind}></Input>
          <Input spellCheck='false' style={{width: '25%'}} addonAfter='/' {...port.bind}></Input>
          <Input spellCheck='false' style={{width: '25%'}} value='jsonrpc'></Input>
        </div>
      </div>
      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderBottom: '1px dotted #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px'}}>Aria2 RPC 密钥</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Input.Password spellCheck='false' iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} {...secret.bind}></Input.Password>
        </div>
      </div>
      <Button style={{margin: '10px'}} type="primary" onClick={save}>保存</Button>
      <div style={{lineHeight: '30px', padding: '8px', borderTop: '1px solid #ddd'}}>设置将在页面刷新后生效</div>
    </div>
  )
}

