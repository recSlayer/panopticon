import type { Component, ParentComponent } from "solid-js"
import Nav from "@/components/Nav"
import ActivityMonitor from "@/components/ActivityMonitor"
import FocusMonitor from "@/components/FocusMonitor"
import VideoMonitor from "@/components/VideoMonitor"

const Layout: ParentComponent = (props) => {
  return (
    <>
      <Nav />
      <ActivityMonitor>
        <div class="md:px-16 max-md:px-2 pt-2 mb-64 max-w-6xl">
          {props.children}
        </div>
      </ActivityMonitor>
    </>
  )
}

export default Layout
