export interface Position {
    x: number;
    y: number;
}

export interface Block {
    id: string;
    width: number;
    height: number;
    position: Position;
    type: 'caocao' | 'zhangfei' | 'guanyu' | 'bing1' | 'bing2' | 'bing3' | 'bing4' | 'huangzhong' | 'zhaoyun' | 'machao';
    name: string;
    image?: any; 
}

export interface GameState {
    blocks: Block[];
    isGameWon: boolean;
    moveCount: number;
    gameHistory: number[];
}
