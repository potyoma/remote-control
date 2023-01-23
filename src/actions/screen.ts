import { Image, mouse, Region, screen } from "@nut-tree/nut-js"
import Jimp from "jimp"
import { Duplex } from "stream"

const SCREENSHOT_OFFSET = 100

const getPrintRegion = (
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const decideStart = (axisPos: number, axisLimit: number) => {
    const start = axisPos - SCREENSHOT_OFFSET
    const end = axisPos + SCREENSHOT_OFFSET
    return Math.min(
      start > 0 ? start : 0,
      end > axisLimit ? axisLimit - SCREENSHOT_OFFSET * 2 : end
    )
  }

  return new Region(
    decideStart(x, width),
    decideStart(y, height),
    SCREENSHOT_OFFSET * 2,
    SCREENSHOT_OFFSET * 2
  )
}

const screenToBase64 = async (screenRegion: Image) => {
  const img = new Jimp(await screenRegion.toRGB())
  return await img.getBase64Async(img.getMIME())
}

const handleScreenActions = async () => {
  const { x, y } = await mouse.getPosition()

  const region = getPrintRegion(
    x,
    y,
    await screen.width(),
    await screen.height()
  )

  const grabbedRegion = await screen.grabRegion(region)
  const asBase64 = screenToBase64(grabbedRegion)
  return (stream: Duplex) => stream.write(`prnt_scrn ${asBase64}`)
}

export default handleScreenActions
