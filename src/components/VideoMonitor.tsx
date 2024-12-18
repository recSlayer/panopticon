import {
  Component,
  createEffect,
  createResource,
  createSignal,
  Show,
} from "solid-js"
import recIcon from "@/assets/rec.png"

const constraints: MediaStreamConstraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440,
    },
    facingMode: { ideal: "front" },
  },
  audio: true,
}

const VideoMonitor: Component<{}> = (props) => {
  if (
    !("mediaDevices" in navigator) ||
    !("getUserMedia" in navigator.mediaDevices)
  ) {
    console.log("No media api available")
  }
  const [mediaStream, { mutate, refetch }] = createResource<MediaStream>(() =>
    navigator.mediaDevices.getUserMedia(constraints)
  )
  console.log("Media api available")
  createEffect(() => {
    if (mediaStream.state == "errored") {
      if (mediaStream.error instanceof OverconstrainedError) {
        console.log("overconstrained")
      } else if (mediaStream.error instanceof DOMException) {
        const domException = mediaStream.error as DOMException
        if (domException.name == "NotAllowedError") {
          alert(
            "You must except camera and microphone permissions to use this site"
          )
          refetch()
        }
      }
    } else if (mediaStream.state == "ready" && videoElement) {
      console.log("ready")
      videoElement.srcObject = mediaStream()
    }
  })

  let videoElement: HTMLVideoElement | undefined = undefined

  const [blink, setBlink] = createSignal(true)

  setInterval(() => {
    setBlink(!blink())
  }, 2000)

  return (
    <Show
      when={mediaStream.state == "ready"}
      fallback={<div class="bg-black h-48 aspect-video" />}
    >
      <video
        class="object-contain max-h-48"
        style="transform: scaleX(-1);"
        autoplay={true}
        muted={true}
        ref={videoElement}
      ></video>
      <img
        class="h-10 absolute bottom-5 left-5 transition-opacity delay-1000"
        classList={{ "opacity-100": blink(), "opacity-0": !blink() }}
        src={recIcon}
      />
    </Show>
  )
}

export default VideoMonitor
