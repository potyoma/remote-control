import { Button, down, mouse, right, left, up } from "@nut-tree/nut-js"

const drawRectangle = async (sizeX: number, sizeY?: number) => {
  await mouse.move(right(sizeX))
  await mouse.move(down(sizeY ?? sizeX))
  await mouse.move(left(sizeX))
  await mouse.move(up(sizeY ?? sizeX))
}

const drawCircle = async (x: number, y: number, radius: number) => {
  const step = Math.PI / 100
  const fullTurn = Math.PI * 2
  const center = x + radius

  const getPoint = (
    start: number,
    radius: number,
    angle: number,
    isYAxis: boolean
  ) =>
    start - Math.round(radius * (isYAxis ? Math.sin(angle) : Math.cos(angle)))

  const points = Array.from({ length: Math.ceil(fullTurn / step) }, (_, i) => {
    const angle = i * step
    return {
      x: getPoint(center, radius, angle, false),
      y: getPoint(y, radius, angle, true),
    }
  })

  await mouse.move(points)
}

const decideHandler = async (action: string, args: any) => {
  switch (action) {
    case "circle":
      const { x, y } = await mouse.getPosition()
      return async () => await drawCircle(x, y, parseInt(args[0]))
    case "rectangle":
      return async () =>
        await drawRectangle(parseInt(args[0]), parseInt(args[1]))
    case "square":
      return async () => await drawRectangle(parseInt(args))
    default:
      return
  }
}

const handleDrawActions = async (action: string, args: any) => {
  await mouse.pressButton(Button.LEFT)
  const handler = await decideHandler(action, args)
  await handler?.()
  await mouse.releaseButton(Button.LEFT)
}

export default handleDrawActions
