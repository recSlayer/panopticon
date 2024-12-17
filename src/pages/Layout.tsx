import type { Component, ParentComponent } from "solid-js"
import Footer from "@/components/Footer"
import Nav from "@/components/Nav"

const Layout: ParentComponent = (props) => {
  return (
    <div>
      <Nav />
      <div class="md:px-32 max-md:px-2">{props.children}</div>
      <Footer />
    </div>
  )
}

export default Layout
