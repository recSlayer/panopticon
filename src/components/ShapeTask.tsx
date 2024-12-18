import {
  Component,
  createMemo,
  createSignal,
  For,
  JSX,
  onMount,
  ParentComponent,
  useContext,
} from "solid-js"
import { ActiveContext } from "./ActivityMonitor"

type TaskProps = {}

const ShapeTask: Component<TaskProps> = (props) => {
  const activeTime = useContext(ActiveContext)
  const [correct, setCorrect] = createSignal(0)
  const [incorrect, setIncorrect] = createSignal(0)
  function onCorrect() {
    setCorrect(correct() + 1)
    setShapeNumber(randomShapeNumber())
  }
  function onIncorrect() {
    setIncorrect(incorrect() + 1)
  }
  function randomShapeNumber(): number {
    return Math.floor(Math.random() * 14 + 2)
  }
  function resolveShape(num: number): JSX.Element {
    if (num == 2) {
      return (
        <Shape
          shapeType={"circle"}
          onCorrect={onCorrect}
          onIncorrect={onIncorrect}
        >
          <Circle class="fill-blue-700" size={100} />
        </Shape>
      )
    } else {
      return (
        <Shape shapeType={num} onCorrect={onCorrect} onIncorrect={onIncorrect}>
          <Polygon class="fill-blue-700" sides={num} size={100} />
        </Shape>
      )
    }
  }
  const [shapeNumber, setShapeNumber] = createSignal(randomShapeNumber())
  const shape = createMemo(() => resolveShape(shapeNumber()))
  return (
    <>
      <h1 class="text-3xl">Classify The Shape</h1>
      <p>Drag the shape to the corresponding hole</p>
      <div class="border-2 w-full border-black aspect-video flex flex-col justify-between items-center">
        <div class="grid-flow-row justify-items-center">
          <For each={[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]}>
            {(item) => (
              <ShapeHole shapeType={item}>
                <Polygon class="fill-black" sides={item} size={100} />
              </ShapeHole>
            )}
          </For>
          <ShapeHole shapeType={"circle"}>
            <Circle class="fill-black" size={100} />
          </ShapeHole>
        </div>

        {shape()}
      </div>
      <div>Correct: {correct()}</div>
      <div>Incorrect: {incorrect()}</div>
      <div>
        Efficiency:{" "}
        {(((correct() + incorrect()) / activeTime!()) * 60).toFixed(2)}{" "}
        classifications per minute
      </div>
    </>
  )
}

export default ShapeTask

type ShapeType = "circle" | PolygonType
type PolygonType = number

const Shape: ParentComponent<{
  shapeType: ShapeType
  onCorrect: () => void
  onIncorrect: () => void
}> = (props) => {
  const onDragStart: JSX.EventHandlerUnion<
    HTMLDivElement,
    DragEvent,
    JSX.EventHandler<HTMLDivElement, DragEvent>
  > = (event: DragEvent) => {
    event.dataTransfer!.setData("text/plain", thisElement!.id)
    thisElement && (thisElement.style.opacity = "0.4")
  }

  const onDragEnd: JSX.EventHandlerUnion<
    HTMLDivElement,
    DragEvent,
    JSX.EventHandler<HTMLDivElement, DragEvent>
  > = (event: DragEvent) => {
    thisElement && (thisElement.style.opacity = "1")
  }

  onMount(() => {
    thisElement?.addEventListener("shapeEvent", (event: unknown) => {
      const shapeHoleType = (event as { detail: { shapeHoleType: ShapeType } })
        .detail.shapeHoleType
      console.log(shapeHoleType)
      if (props.shapeType == shapeHoleType) {
        props.onCorrect()
      } else {
        props.onIncorrect()
      }
    })
  })

  let thisElement: HTMLDivElement | undefined = undefined
  return (
    <div
      class="size-fit m-3 cursor-grab"
      id="1234567"
      ref={thisElement}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {props.children}
    </div>
  )
}

const ShapeHole: ParentComponent<{ shapeType: ShapeType }> = (props) => {
  const onDrop: JSX.EventHandlerUnion<
    HTMLDivElement,
    DragEvent,
    JSX.EventHandler<HTMLDivElement, DragEvent>
  > = (event) => {
    event.preventDefault()
    const data = event.dataTransfer?.getData("text/plain")
    if (data) {
      document.getElementById(data)?.dispatchEvent(
        new CustomEvent("shapeEvent", {
          detail: { shapeHoleType: props.shapeType },
        })
      )
    }
  }

  return (
    <div
      class="inline-block m-3 size-fit"
      onDrop={onDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      {props.children}
    </div>
  )
}

const Polygon: Component<{ sides: number; size: number; class?: string }> = (
  props
) => {
  const points = createMemo(() =>
    calculatePolygonPoints(props.sides, props.size)
  )
  return (
    <svg class="" height={props.size} width={props.size}>
      <polygon class={props.class} points={points()} />
    </svg>
  )
}

const Circle: Component<{ size: number; class?: string }> = (props) => {
  return (
    <svg height={props.size} width={props.size}>
      <circle
        class={props.class}
        r={props.size / 2.0}
        cx={props.size / 2.0}
        cy={props.size / 2.0}
      />
    </svg>
  )
}

function calculatePolygonPoints(sides: number, size: number): string {
  const halfSize = size / 2.0
  const angle = (2 * Math.PI) / sides
  let points: string = ""
  for (let i = 0; i < sides; i++) {
    points +=
      (Math.cos(angle * i) * halfSize + halfSize).toFixed() +
      " " +
      (Math.sin(angle * i) * halfSize + halfSize).toFixed() +
      ", "
  }
  return points
}
