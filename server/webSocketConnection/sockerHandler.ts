import { Server as SocketIoServer, Socket } from 'socket.io'
import { getFamilyMembersById } from '../db/functions/websocketQureys'
import * as db from '../db/functions/notifications'

const userSocketMap = new Map<string, Socket>()
let ioInstance: SocketIoServer // Variable to store the io instance

const handleSocketMessages = (io: SocketIoServer) => {
  ioInstance = io // Assign the io instance to the variable

  io.on('connection', (socket: Socket & { userId?: string }) => {
    try {
      console.log('A user connected to WebSocket')

      socket.on('link_user', (userId: string) => {
        console.log('ooooo')
        socket.userId = userId
        userSocketMap.set(userId, socket)
        console.log(`WebSocket connection linked to user ${userId}`)
        socket.removeAllListeners('update_query_key')
        socket.on(
          'update_query_key',
          async (data: {
            queryKey: string[]
            users: 'parent' | 'family' | 'user'
            notificationMessage: string
            pageUrl: string
          }) => {
            const queryKey = data.queryKey
            const users = data.users
            const notificationMessage = data.notificationMessage
            const pageUrl = data.pageUrl

            if (!socket.userId) return
            const familyMembers: any = []
            if (users === 'family') {
              familyMembers.push(
                await getFamilyMembersById(socket.userId, 'family')
              )
            } else if (users === 'parent') {
              familyMembers.push(
                await getFamilyMembersById(socket.userId, 'parent')
              )
            } else if (users === 'user') {
              familyMembers.push(
                await getFamilyMembersById(socket.userId, 'user')
              )
            }

            if (familyMembers.length === 0) return

            console.log('familyMembers', familyMembers)
            familyMembers.forEach(async (memberId: any) => {
              await db.addUserNotification(
                memberId.auth_id,
                notificationMessage,
                pageUrl
              )
              sendMessageToUser(memberId.id, { queryKey })
            })
          }
        )

        socket.on('disconnect', () => {
          console.log(`User ${userId} disconnected from WebSocket`)
          userSocketMap.delete(userId)
        })
      })
    } catch (error) {
      console.error('Error during WebSocket connection:', error)
      socket.disconnect(true)
    }
  })

  io.on('error', (error) => {
    console.error('WebSocket server error:', error)
  })
}

const sendMessageToUser = (userId: string, message: any) => {
  try {
    const userSocket = userSocketMap.get(String(userId))
    if (userSocket) {
      console.log(`Sending message to user: ${userId}`, message)
      userSocket.emit('notification_data', message)
    }
  } catch (error) {
    console.error('Error sending message to user:', error)
  }
}

export { handleSocketMessages, sendMessageToUser }
