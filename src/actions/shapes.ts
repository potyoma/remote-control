import { Button, down, mouse, right, left, up } from "@nut-tree/nut-js"

const drawRectangle = async (sizeX: number, sizeY?: number) => {
  await mouse.move(right(sizeX))
  await mouse.move(down(sizeY ?? sizeX))
  await mouse.move(left(sizeX))
  await mouse.move(up(sizeY ?? sizeX))
}

const drawCircle = async (x: number, y: number, radius: number) => {
  const step = 0.01 * Math.PI
  const fullTurn = Math.PI * 2
  const centerX = x + radius

  for (let angle = 0; angle <= fullTurn; angle += step) {
    await mouse.move([
      {
        x: centerX - Math.round(radius * Math.cos(angle)),
        y: y - Math.round(radius * Math.sin(angle)),
      },
    ])
  }
}

const decideHandler = async (action: string, args: any) => {
  switch (action) {
    case "circle":
      const position = await mouse.getPosition()
      return async () => await drawCircle(position.x, position.y, args)
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
