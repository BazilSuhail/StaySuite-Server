import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })
  export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private connectedUsers: Map<string, string> = new Map(); // Stores connected users
  
    // Handle new connections
    handleConnection(client: Socket) {
      const userId = client.handshake.auth.userId;
  
      if (userId) {
        this.connectedUsers.set(userId, client.id);
        //console.log(`User connected: ${userId} (Socket ID: ${client.id})`);
      } else {
        console.log('No userId provided during connection.');
      }
    }
  
    // Handle disconnections
    handleDisconnect(client: Socket) {
      for (const [userId, socketId] of this.connectedUsers.entries()) {
        if (socketId === client.id) {
          this.connectedUsers.delete(userId);
          console.log(`User disconnected: ${userId}`);
          break;
        }
      }
    }
  
    // Send a message to a specific user
    sendMessageToUser(userId: string, message: Object) {
      const socketId = this.connectedUsers.get(userId);
      if (socketId) {
        this.server.to(socketId).emit('notification', message);
        console.log(`Message sent to user ${userId}: ${message}`);
      } else {
        console.log(`User ${userId} is not connected.`);
      }
    }
  
    // Example of handling custom messages
    /*@SubscribeMessage('message')
    handleMessage(client: Socket, data: string) {
      console.log(`Message from ${client.id}: ${data}`);
      client.emit('response', `Server received: ${data}`);
    }*/
  }
  