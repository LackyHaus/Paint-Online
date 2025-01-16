const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()

const PORT = process.env.PORT || 5000

CanvasBase = {}

app.ws('/ws', (ws, req) => {
    ws.on('message', msg => {
        msg = JSON.parse(msg)
        switch (msg.method) {
            case 'connection':
                connectionHandler(ws, msg)
                break
            case 'draw':
                broadcastConnection(ws, msg)
                break
            
            case 'save':
                if (msg.figure.type === 'canvasState') {
                    CanvasBase[msg.id] = msg.figure.canvasState
                    break
                }
            default:
                console.log('Unknown message type:', msg.method)
        }
    })
})

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            if (msg.method === 'connection') {
                const canvas = CanvasBase[msg.id]
                if (canvas) {
                    client.send(JSON.stringify({
                        id: client.id,
                        method: 'draw',
                        figure: {
                            type: 'canvasState',
                            canvasState: canvas
                        }
                    }))
                }
            } else {
                client.send(JSON.stringify(msg))
            }
        }
    })
}