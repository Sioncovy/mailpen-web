import { to } from 'await-to-js'
import { handleError } from './common'

export interface InnerDeviceItem {
  id: string
  kind: MediaDeviceKind
  label: string
}

export enum DeviceKind {
  AudioInput = 'audioinput',
  AudioOutput = 'audiooutput',
  VideoInput = 'videoinput'
}

export type Constraints = {
  audio: boolean
  video: boolean
}

export async function initLocalDevice(constraints: Constraints) {
  const localDevice = {
    audioInput: [] as InnerDeviceItem[],
    videoInput: [] as InnerDeviceItem[],
    audioOutput: [] as InnerDeviceItem[]
  }

  // 判断浏览器是否能正常获取到用户的媒体设备
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.error('浏览器不支持获取媒体设备')
    return
  }

  // 获取媒体流
  const [getUserMediaError, stream] = await to(
    navigator.mediaDevices.getUserMedia(constraints)
  )
  if (getUserMediaError || !stream) {
    handleError(getUserMediaError)
  }

  // 关闭未关闭的媒体流
  stream?.getTracks().forEach((track) => {
    track.stop()
  })

  // 获取用户的设备列表
  const [enumerateDevicesError, devices] = await to(
    navigator.mediaDevices.enumerateDevices()
  )
  if (enumerateDevicesError) {
    handleError(enumerateDevicesError)
  }
  devices?.forEach((device) => {
    const { deviceId: id, kind, label } = device
    const item: InnerDeviceItem = {
      id,
      kind,
      label
    }
    if (kind === DeviceKind.AudioInput) {
      if (!localDevice.audioInput.find((item) => item.id === id)) {
        localDevice.audioInput.push(item)
      }
    }
    if (kind === DeviceKind.AudioOutput) {
      if (!localDevice.audioOutput.find((item) => item.id === id)) {
        localDevice.audioOutput.push(item)
      }
    }
    if (kind === DeviceKind.VideoInput) {
      if (!localDevice.videoInput.find((item) => item.id === id)) {
        localDevice.videoInput.push(item)
      }
    }
  })
  return localDevice
}

export async function getLocalUserMedia(constraints: Constraints) {
  return await navigator.mediaDevices
    .getUserMedia(constraints)
    .catch(handleError)
}
