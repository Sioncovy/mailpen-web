import { UploadOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  TreeSelect,
  Upload
} from 'antd'
import type { FormInstance } from 'antd/lib'
import { useLayoutEffect, type FC } from 'react'
import styles from './index.module.less'
import { XFormItem } from './types'

type PropsType = {
  width?: string
  title: string
  open: boolean
  confirmLoading?: boolean
  items: XFormItem[]
  form?: FormInstance<any>
  onConfirm?: (data: any) => void
  onClose?: () => void
  centered?: boolean
  initValues?: any
}

const FormModal: FC<PropsType> = ({
  width,
  open,
  title,
  items,
  confirmLoading,
  form: propForm,
  onClose,
  onConfirm,
  centered = false,
  initValues = {}
}) => {
  // 处理 items
  const renderItems = items.map((item) => {
    if (item.render) return item
    const newItem = { ...item }
    switch (item.type) {
      case 'input':
        newItem.render = (
          <Input
            placeholder={item.placeholder ?? '请输入'}
            {...item.otherProps}
          />
        )
        break
      case 'input-number':
        newItem.render = (
          <InputNumber
            placeholder={item.placeholder ?? '请输入'}
            {...item.otherProps}
          />
        )
        break
      case 'textarea':
        newItem.render = (
          <Input.TextArea
            placeholder={item.placeholder ?? '请输入'}
            {...item.otherProps}
          />
        )
        break
      case 'select':
        newItem.render = (
          <Select
            placeholder={item.placeholder ?? '请选择'}
            options={item.options}
            showSearch={true}
            optionFilterProp="label"
            {...item.otherProps}
          />
        )
        break
      case 'tree-select':
        newItem.render = (
          <TreeSelect
            placeholder={item.placeholder ?? '请选择'}
            treeData={item.treeData}
            treeExpandAction={'click'}
            treeNodeFilterProp={'label'}
            showSearch={true}
            filterTreeNode={(input, node) => {
              if (typeof node.label !== 'string') return true
              return node.label?.indexOf(input) !== -1
            }}
            {...item.otherProps}
          />
        )
        break
      case 'upload':
        newItem.render = (
          <Upload {...item.otherProps}>
            <Button
              icon={<UploadOutlined />}
              style={{ display: 'block', width: '100%' }}
            >
              上传
            </Button>
          </Upload>
        )
        break
      case 'switch':
        newItem.render = <Switch {...item.otherProps} />
        break
    }
    return newItem
  })

  const [innerForm] = Form.useForm()

  const form = propForm ?? innerForm

  const handleConfirmClick = () => {
    form.validateFields().then(onConfirm)
  }

  useLayoutEffect(() => {
    if (open && !propForm) {
      form.resetFields()
      form.setFieldsValue(initValues)
    }
  }, [open, propForm])

  return (
    <Modal
      title={title}
      open={open}
      closable={false}
      footer={null}
      width={width ?? '318px'}
      centered={centered}
    >
      <div className={styles.addModal}>
        <div className="content">
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            // initialValues={initialValues || {}}
          >
            {renderItems.map((item) => (
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={item.rules}
                valuePropName={item.valuePropName}
              >
                {item.render}
              </Form.Item>
            ))}
          </Form>
        </div>
        <div className="footer">
          <Button onClick={onClose}>取消</Button>
          <Button
            loading={confirmLoading}
            type="primary"
            style={{ marginLeft: '12px' }}
            onClick={handleConfirmClick}
          >
            确认
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default FormModal
