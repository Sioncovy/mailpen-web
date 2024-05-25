import type { ReactNode } from 'react'
import type {
  SelectProps,
  InputProps,
  UploadProps,
  TreeSelectProps,
  InputNumberProps,
  RadioProps,
  SwitchProps
} from 'antd'
import type { Rule } from 'antd/es/form'

type CommonProps = {
  name: string
  label: string
  placeholder?: string
  render?: ReactNode
  rules?: Rule[]
  valuePropName?: string
}

export type XFormItem = CommonProps &
  (
    | {
        type: 'input'
        otherProps?: InputProps
      }
    | {
        type: 'select'
        options: { label: ReactNode; value: any }[]
        otherProps?: SelectProps<any>
      }
    | {
        type: 'upload'
        otherProps?: UploadProps
      }
    | {
        type: 'textarea'
        otherProps?: TextAreaProps
      }
    | {
        type: 'tree-select'
        treeData: TreeSelectProps<any>['treeData']
        otherProps?: TreeSelectProps<any>
      }
    | {
        type: 'input-number'
        otherProps?: InputNumberProps
      }
    | {
        type: 'switch'
        otherProps?: SwitchProps
      }
  )
