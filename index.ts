import { httpServer } from "./src/http_server"
import handleMessage from "./src/core/handleMessage"
import { WebSocketServer, createWebSocketStream } from "ws"

const HTTP_PORT = 8181
const WEBSOCKET_PORT = 8080

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

const wss = new WebSocketServer({ port: WEBSOCKET_PORT }, () => {
  console.log(`Start websocket server on the ${WEBSOCKET_PORT}`)
})

wss.on("connection", ws => {
  const wsStream = createWebSocketStream(ws, { decodeStrings: false })
  wsStream.on("data", data => {
    handleMessage(data, wsStream)
  })
})

process.on("SIGINT", () => {
  for (const client of wss.clients.values()) client.close()
  wss.close(() => httpServer.close(() => process.exit()))
})
