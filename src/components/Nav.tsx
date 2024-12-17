import { Component, createSignal } from "solid-js"
import panopticonImg from "@/assets/panopticon-with-text.svg"
import hamburger from "@/assets/hamburger.png"
import { A } from "@solidjs/router"

const Nav: Component<{}> = (props) => {
  const [hidden, setHidden] = createSignal(true)
  return (
    <div class="bg-neutral-200 overflow-hidden sm:sticky max-sm:relative">
      <div class="h-20 sm:float-left flex flex-row justify-between">
        <A class="inline-block h-full" href="/">
          <img class="h-full p-2" src={panopticonImg} />
        </A>
        <img
          class="cursor-pointer h-10 p-3 inline-block sm:hidden align-top my-auto"
          src={hamburger}
          onclick={() => {
            setHidden(!hidden())
          }}
        ></img>
      </div>
      <nav class="block sm:float-left max-sm:float-none sm:h-20">
        <A
          class="content-center block sm:px-3 sm:float-left max-sm:float-none sm h-full text-center hover:bg-neutral-400"
          classList={{ "max-sm:hidden": hidden() }}
          href="/about"
        >
          About
        </A>
      </nav>
    </div>
  )
}

export default Nav
