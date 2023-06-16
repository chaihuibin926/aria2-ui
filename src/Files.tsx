import { Progress } from "antd"


export default function Files({info}: any) {

  return <div>
    
      {
        // @ts-ignore
        info.files.map((it, idx) => {
          return <div key={idx} style={{display: 'flex', height: '40px', lineHeight: '40px', backgroundColor: '#F9F9F9', paddingLeft: '20px'}}>
            <div style={{width: '65%'}}>{it.path.split('/').slice(-1)}</div>
            <Progress
              style={{width: '20%'}}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              percent={Number((it.completedLength / it.length).toFixed(3)) * 100}
            />
            <div style={{width: '15%'}}>{(it.length / 1024).toFixed(2) + 'KB'}</div>
          </div>
        })
      }  
  </div>
}