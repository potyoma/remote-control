import { down, mouse, right, up, left } from "@nut-tree/nut-js"
import { Duplex } from "stream"

const handleMouseActions = async (action: string, args: any) => {
  console.log(action)
  switch (action) {
    case "up":
      return await mouse.move(up(parseInt(args)))
    case "down":
      return await mouse.move(down(parseInt(args)))
    case "left":
      return await mouse.move(left(parseInt(args)))
    case "right":
      return await mouse.move(right(parseInt(args)))
    case "position":
      const { x, y } = await mouse.getPosition()
      return (stream: Duplex) => stream.write(`mouse_position ${x},${y}`)
    default:
      return
  }
}

export default handleMouseActions
