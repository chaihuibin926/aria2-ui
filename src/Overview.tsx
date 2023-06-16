

export default function Overview({info}: any) {

  return <div>
    <div className="taskInfo">
      <div>任务名称</div>
      <div>{info.files[0].path.split('/').slice(-1)}</div>
    </div>
    <div className="taskInfo">
      <div>任务大小</div>
      <div>{Math.trunc((info.files[0].length / 1024) * 100) / 100 + 'K'}</div>
    </div>
    <div className="taskInfo">
      <div>任务状态</div>
      <div>{info.files[0].length === info.files[0].completedLength ? '已完成' : '未完成'}</div>
    </div>
    <div className="taskInfo">
      <div>进度</div>
      <div>
        {
          // @ts-ignore
          (info.files[0].completedLength / info.files[0].length * 100).toFixed(2) + '%'
        }
      </div>
    </div>
    <div className="taskInfo">
      <div>下载</div>
      <div>{Math.trunc((info.files[0].completedLength / 1024) * 100) / 100 + 'K'}</div>
    </div>
    <div className="taskInfo">
      <div>下载地址</div>
      <div>{info.files[0].uris[0].uri}</div>
    </div>
    <div className="taskInfo">
      <div>下载路径</div>
      <div>{info.dir}</div>
    </div>
  </div>
}