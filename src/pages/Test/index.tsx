import { REACT_APP_API } from '@/config'
import { Typography } from 'antd'

const Test = () => {
  return (
    <div>
      <Typography.Title>测试页面</Typography.Title>
      {/* 表单提交文件 */}
      <form
        action={`${REACT_APP_API}/files`}
        method="post"
        encType="multipart/form-data"
        accept-charset="UTF-8"
      >
        <input type="file" name="file" />
        <button type="submit">提交</button>
      </form>
    </div>
  )
}

export default Test
