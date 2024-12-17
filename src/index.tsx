/* @refresh reload */
import { render } from "solid-js/web"
import "./index.css"
import Layout from "./pages/Layout"
import { Route, Router } from "@solidjs/router"
import Home from "./pages/Home"
import About from "./pages/About"
import NotFound from "./pages/NotFound"

const root = document.getElementById("root")

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  )
}

render(
  () => (
    <Router base={import.meta.env.BASE_URL} root={Layout}>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="*404" component={NotFound} />
    </Router>
  ),
  root!
)
