export interface Position {
    x: number;
    y: number;
}

export interface Block {
    id: string;
    width: number;
    height: number;
    position: Position;
    type: 'caocao' | 'general' | 'soldier';
    name: string;
    image?: any; 
}

export interface GameState {
    blocks: Block[];
    isGameWon: boolean;
    moveCount: number;
    gameHistory: number[];
}
