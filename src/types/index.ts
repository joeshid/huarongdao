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
}

export interface GameState {
    blocks: Block[];
    isGameWon: boolean;
}
