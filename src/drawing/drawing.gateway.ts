import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
} from '@nestjs/websockets';

// payload
type Position = {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string
}

@WebSocketGateway({ cors: true })
export class DrawingGateway implements OnGatewayConnection, OnGatewayDisconnect {

    // 클라이언트 배열
    drClients=[];

    // 소켓 통신 시작
    async handleConnection(client: any): Promise<void> {
        this.users++;
        this.drClients.push(client);
        this.server.emit('users', this.users);
    }

    // 소켓 통신 해제
    async handleDisconnect(): Promise<void> {
        this.users--;
        this.server.emit('users', this.users);
    }

    @WebSocketServer() server: any;
    users: number = 0;
    
    @SubscribeMessage('draw')
    async onPosition(client: any, data: Position): Promise<void> {
        // broadcast로 자신이 아닌 다른 클라이언트에게 메세지
        client.broadcast.emit('draw', data);
    }
}