import { useEffect, useRef } from 'react'
import { CallType } from '../Chat'

interface VideoPlayerProps {
  stream: MediaStream
  type: CallType
  // peerConnection: RTCPeerConnection
  // localUID: string
  // remoteUID: string
}

const VideoPlayer = ({
  // peerConnection,
  // localUID,
  // remoteUID,
  stream,
  type
}: VideoPlayerProps) => {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (ref.current) {
      const videoStream = ref.current.srcObject as MediaStream
      if (videoStream) {
        videoStream.getAudioTracks().forEach((e) => {
          videoStream.removeTrack(e)
        })
        videoStream.getVideoTracks().forEach((e) => {
          videoStream.removeTrack(e)
        })
      }
      ref.current.srcObject = stream
      ref.current.muted = true
      ref.current.play()
    }
  }, [stream])

  return type === CallType.Video ? (
    <video style={{ width: '100%' }} ref={ref} autoPlay controls />
  ) : (
    <audio style={{ width: '100%' }} ref={ref} autoPlay controls />
  )
}

export default VideoPlayer
