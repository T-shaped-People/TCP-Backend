import { WebSocketGateway, 
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect, } from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class DrawingGateway implements OnGatewayConnection, OnGatewayDisconnect {
@WebSocketServer() server: any;
users: number = 0; 

@SubscribeMessage('')
async onChat (client: any, x: any, y: any): Promise<void> {
    client.broadcast.emit('chat', x, y);
}
}