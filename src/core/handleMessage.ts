import handleMouseActions from "../actions/mouse"
import handleDrawActions from "../actions/shapes"
import handleScreenActions from "../actions/screen"
import { Duplex } from "stream"

const getHandleResponse = async (
  handler: string,
  action: string,
  args: any
) => {
  switch (handler) {
    case "mouse":
      return await handleMouseActions(action, args)
    case "draw":
      return await handleDrawActions(action, args)
    case "prnt":
      return await handleScreenActions()
    default:
      return
  }
}

const handleMessage = async (chunk: any, stream: Duplex) => {
  const [command, ...args] = chunk.toString("utf-8").split(" ")
  const [handler, action] = command.split("_")

  const handlerResponse = await getHandleResponse(handler, action, args)
  if (typeof handlerResponse === "function") handlerResponse?.(stream)
  else stream.write(`${command}_${args}`)
}

export default handleMessage
