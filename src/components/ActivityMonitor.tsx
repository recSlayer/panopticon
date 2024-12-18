import {
  Accessor,
  Component,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  ParentComponent,
} from "solid-js"
import FocusMonitor from "./FocusMonitor"
import VideoMonitor from "./VideoMonitor"

const TIME_OUT = 5

export const ActiveContext = createContext<Accessor<number>>()

const ActivityMonitor: ParentComponent<{}> = (props) => {
  const [active, setActive] = createSignal(true)
  const [timeSinceActive, setTimeSinceActive] = createSignal(0)
  const [totalActiveTime, setTotalActiveTime] = createSignal(0)
  const [totalTime, setTotalTime] = createSignal(0)

  setInterval(() => {
    setTimeSinceActive(timeSinceActive() + 1)
    setTotalTime(totalTime() + 1)
    if (timeSinceActive() > TIME_OUT) {
      setActive(false)
    } else {
      setTotalActiveTime(totalActiveTime() + 1)
    }
  }, 1000)

  // Add event listeners
  const activate = () => {
    setActive(true)
    setTimeSinceActive(0)
  }

  activate()

  addEventListener("mousemove", activate)
  addEventListener("keypress", activate)

  // On clean up
  onCleanup(() => {
    removeEventListener("mousemove", activate)
    removeEventListener("keypress", activate)
  })

  return (
    <>
      <ActiveContext.Provider value={totalActiveTime}>
        {props.children}
      </ActiveContext.Provider>
      <div class="fixed w-full bottom-0 left-0">
        <div
          class="bg-neutral-200 rounded-lg p-3 size-fit -z-50 absolute bottom-0 right-0"
          classList={{ "bg-green-400": active(), "bg-red-400": !active() }}
        >
          <VideoMonitor />
        </div>
        <div
          class="grid auto-cols-auto grid-flow-col px-2 z-50"
          classList={{ "bg-green-400": active(), "bg-red-400": !active() }}
        >
          <p class="text-nowrap">{active() ? "Active" : "Inactive"}</p>
          <p class="text-nowrap">Total Time Active: {totalActiveTime()}</p>
          <p class="text-nowrap">
            {`Percent Time Active: ${(
              (totalActiveTime() / totalTime()) *
              100
            ).toFixed(0)}%`}
          </p>
          <FocusMonitor />
        </div>
      </div>
    </>
  )
}

export default ActivityMonitor
