import { Component, createSignal, onCleanup } from "solid-js"

const FocusMonitor: Component<{}> = (props) => {
  const [timesLost, setTimesLost] = createSignal(0)
  const onFocusLost = () => {
    //alert("It looks like you left the page, stay productive")
    setTimesLost(timesLost() + 1)
  }
  addEventListener("blur", onFocusLost)

  onCleanup(() => {
    removeEventListener("blur", onFocusLost)
  })
  return <p class="text-nowrap">Left Page: {timesLost()}</p>
}

export default FocusMonitor
