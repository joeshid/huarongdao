import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Block } from '../types';

const HISTORY_KEY = 'huarongdao_history';
const MAX_HISTORY = 5;

const initialBlocks: Block[] = [
    { 
        id: 'caocao', 
        width: 2, 
        height: 2, 
        position: { x: 1, y: 0 }, 
        type: 'caocao', 
        name: '曹操'
    },
    { 
        id: 'zhangfei', 
        width: 1, 
        height: 2, 
        position: { x: 0, y: 0 }, 
        type: 'zhangfei', 
        name: '张飞'
    },
    { 
        id: 'guanyu', 
        width: 1, 
        height: 2, 
        position: { x: 3, y: 0 }, 
        type: 'guanyu', 
        name: '关羽'
    },
    { 
        id: 'bing1', 
        width: 1, 
        height: 1, 
        position: { x: 0, y: 2 }, 
        type: 'bing1', 
        name: '兵1'
    },
    { 
        id: 'bing2', 
        width: 1, 
        height: 1, 
        position: { x: 1, y: 2 }, 
        type: 'bing2', 
        name: '兵2'
    },
    { 
        id: 'bing3', 
        width: 1, 
        height: 1, 
        position: { x: 2, y: 2 }, 
        type: 'bing3', 
        name: '兵3'
    },
    { 
        id: 'bing4', 
        width: 1, 
        height: 1, 
        position: { x: 3, y: 2 }, 
        type: 'bing4', 
        name: '兵4'
    },
    { 
        id: 'huangzhong', 
        width: 2, 
        height: 1, 
        position: { x: 1, y: 3 }, 
        type: 'huangzhong', 
        name: '黄忠'
    },
    { 
        id: 'zhaoyun', 
        width: 1, 
        height: 2, 
        position: { x: 0, y: 3 }, 
        type: 'zhaoyun', 
        name: '赵云'
    },
    { 
        id: 'machao', 
        width: 1, 
        height: 2, 
        position: { x: 3, y: 3 }, 
        type: 'machao', 
        name: '马超'
    }
];

export const useGameState = (initialBlocks: Block[]) => {
    const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
    const [moveCount, setMoveCount] = useState(0);
    const [gameHistory, setGameHistory] = useState<number[]>([]);
    const [isGameWon, setIsGameWon] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    
    // 使用 ref 来跟踪当前的方块位置
    const currentBlocksRef = useRef<Block[]>(initialBlocks);

    useEffect(() => {
        currentBlocksRef.current = blocks;
    }, [blocks]);

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        // 检查曹操是否到达底部中间位置
        const caocao = blocks.find(block => block.id === 'caocao');
        if (caocao && caocao.position.x === 1 && caocao.position.y === 3) {
            setIsGameWon(true);
            saveHistory();
        }
    }, [blocks]);

    const loadHistory = async () => {
        try {
            const history = await AsyncStorage.getItem(HISTORY_KEY);
            if (history) {
                setGameHistory(JSON.parse(history));
            }
        } catch (error) {
            console.error('Error loading history:', error);
        }
    };

    const saveHistory = async () => {
        try {
            const newHistory = [moveCount, ...gameHistory].slice(0, MAX_HISTORY);
            await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
            setGameHistory(newHistory);
        } catch (error) {
            console.error('Error saving history:', error);
        }
    };

    const checkCollision = (block: Block, newPosition: { x: number; y: number }) => {
        // 检查边界
        if (newPosition.x < 0 || 
            newPosition.x + block.width > 4 || 
            newPosition.y < 0 || 
            newPosition.y + block.height > 5) {
            console.log('超出边界', { block, newPosition });
            return true;
        }

        // 检查与其他方块的碰撞
        return currentBlocksRef.current.some(other => {
            if (other.id === block.id) return false;

            const hasCollision = !(
                newPosition.x >= other.position.x + other.width ||  // 在右边
                newPosition.x + block.width <= other.position.x ||  // 在左边
                newPosition.y >= other.position.y + other.height || // 在下边
                newPosition.y + block.height <= other.position.y    // 在上边
            );

            if (hasCollision) {
                console.log('碰撞检测', {
                    moving: {
                        id: block.id,
                        position: newPosition,
                        size: { w: block.width, h: block.height }
                    },
                    blocking: {
                        id: other.id,
                        position: other.position,
                        size: { w: other.width, h: other.height }
                    }
                });
            }

            return hasCollision;
        });
    };

    const handleMove = (id: string, newPosition: { x: number; y: number }) => {
        const movingBlock = currentBlocksRef.current.find(b => b.id === id);
        if (!movingBlock) {
            console.log('未找到方块:', id);
            return false;
        }

        // 检查是否是同一个位置
        if (newPosition.x === movingBlock.position.x && 
            newPosition.y === movingBlock.position.y) {
            return false;
        }

        // 检查边界
        if (newPosition.x < 0 || 
            newPosition.x + movingBlock.width > 4 || 
            newPosition.y < 0 || 
            newPosition.y + movingBlock.height > 5) {
            console.log('超出边界:', {
                block: movingBlock.name,
                position: newPosition,
                size: { w: movingBlock.width, h: movingBlock.height }
            });
            return false;
        }

        // 检查移动距离
        const dx = Math.abs(newPosition.x - movingBlock.position.x);
        const dy = Math.abs(newPosition.y - movingBlock.position.y);
        if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) {
            console.log('移动距离不合法:', {
                block: movingBlock.name,
                from: movingBlock.position,
                to: newPosition
            });
            return false;
        }

        // 检查碰撞
        for (const block of currentBlocksRef.current) {
            if (block.id === id) continue;

            const hasCollision = !(
                newPosition.x >= block.position.x + block.width ||  // 在右边
                newPosition.x + movingBlock.width <= block.position.x ||  // 在左边
                newPosition.y >= block.position.y + block.height || // 在下边
                newPosition.y + movingBlock.height <= block.position.y    // 在上边
            );

            if (hasCollision) {
                console.log('发生碰撞:', {
                    moving: {
                        name: movingBlock.name,
                        position: newPosition,
                        size: { w: movingBlock.width, h: movingBlock.height }
                    },
                    blocking: {
                        name: block.name,
                        position: block.position,
                        size: { w: block.width, h: block.height }
                    }
                });
                return false;
            }
        }

        // 更新位置
        setBlocks(prev => prev.map(block => 
            block.id === id 
                ? { ...block, position: newPosition }
                : block
        ));

        // 更新移动次数
        setMoveCount(prev => prev + 1);

        // 检查是否获胜
        if (id === 'caocao' && newPosition.x === 1 && newPosition.y === 3) {
            setIsGameWon(true);
            saveHistory();
        }

        return true;
    };

    const resetGame = () => {
        setBlocks(initialBlocks);
        currentBlocksRef.current = initialBlocks;
        setMoveCount(0);
        setIsGameWon(false);
        setIsMoving(false);
    };

    return {
        blocks,
        moveCount,
        gameHistory,
        isGameWon,
        handleMove,
        resetGame
    };
};
