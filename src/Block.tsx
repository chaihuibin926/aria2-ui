

export default function Block({info}: any) {
  let bitfield = parseInt(info.bitfield, 16).toString(2)
  let blocks = bitfield.slice(0, info.numPieces).split('')
  return (
    <div>
      <div style={{width: '100%', display: "flex", height: '30px', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: '15px', height: '15px', borderRadius: '5px', backgroundColor: 'green'}}></div>已完成
        <div style={{width: '15px', height: '15px', borderRadius: '5px', backgroundColor: 'gray', marginLeft: "10px"}}></div>未完成
      </div>
      <div style={{display: 'flex', padding: '10px', width: '100%'}}>
      {
        blocks.map((block: string, idx: number) => {
          return <div key={idx} style={{width: '15px', height: '15px', borderRadius: '5px', backgroundColor: block ? 'green' : 'gray'}}></div>
        })
      }
      </div>
    </div>
  )
}