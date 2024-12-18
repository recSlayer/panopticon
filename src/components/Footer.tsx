import { Component } from "solid-js"
import ActivityMonitor from "./ActivityMonitor"

const Footer: Component<{}> = (props) => {
  return (
    <footer class="block fixed w-full bottom-0">
      <ActivityMonitor />
    </footer>
  )
}

export default Footer
