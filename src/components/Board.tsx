import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Block } from './Block';
import type { Block as BlockType, Position } from '../types';

const BOARD_WIDTH = 4;
const BOARD_HEIGHT = 5;
const window = Dimensions.get('window');
const GRID_SIZE = Math.floor(Math.min(window.width / BOARD_WIDTH, window.height / BOARD_HEIGHT * 0.8));

const initialBlocks: BlockType[] = [
    { id: 'caocao', width: 2, height: 2, position: { x: 1, y: 0 }, type: 'caocao', name: '曹操' },
    { id: 'zh', width: 1, height: 2, position: { x: 0, y: 0 }, type: 'general', name: '张飞' },
    { id: 'gy', width: 1, height: 2, position: { x: 3, y: 0 }, type: 'general', name: '关羽' },
    { id: 'mc1', width: 1, height: 1, position: { x: 0, y: 2 }, type: 'soldier', name: '兵1' },
    { id: 'mc2', width: 1, height: 1, position: { x: 1, y: 2 }, type: 'soldier', name: '兵2' },
    { id: 'mc3', width: 1, height: 1, position: { x: 2, y: 2 }, type: 'soldier', name: '兵3' },
    { id: 'mc4', width: 1, height: 1, position: { x: 3, y: 2 }, type: 'soldier', name: '兵4' },
    { id: 'hz', width: 2, height: 1, position: { x: 1, y: 3 }, type: 'general', name: '黄忠' },
    { id: 'zy', width: 1, height: 2, position: { x: 0, y: 3 }, type: 'general', name: '赵云' },
    { id: 'ma', width: 1, height: 2, position: { x: 3, y: 3 }, type: 'general', name: '马超' },
];

export const Board: React.FC = () => {
    const [blocks, setBlocks] = useState<BlockType[]>(initialBlocks);
    const [isGameWon, setIsGameWon] = useState(false);

    const isValidMove = (block: BlockType, newPosition: Position): boolean => {
        // 检查是否超出边界
        if (newPosition.x < 0 || newPosition.y < 0 || 
            newPosition.x + block.width > BOARD_WIDTH ||
            newPosition.y + block.height > BOARD_HEIGHT) {
            return false;
        }

        // 检查是否与其他方块重叠
        const otherBlocks = blocks.filter(b => b.id !== block.id);
        for (const otherBlock of otherBlocks) {
            if (isOverlapping(
                { ...block, position: newPosition },
                otherBlock
            )) {
                return false;
            }
        }

        return true;
    };

    const isOverlapping = (block1: BlockType, block2: BlockType): boolean => {
        return !(
            block1.position.x + block1.width <= block2.position.x ||
            block1.position.x >= block2.position.x + block2.width ||
            block1.position.y + block1.height <= block2.position.y ||
            block1.position.y >= block2.position.y + block2.height
        );
    };

    const handleMove = (id: string, newPosition: Position) => {
        const blockToMove = blocks.find(b => b.id === id);
        if (!blockToMove) return;

        if (isValidMove(blockToMove, newPosition)) {
            setBlocks(blocks.map(block => 
                block.id === id 
                    ? { ...block, position: newPosition }
                    : block
            ));

            // 检查是否获胜（曹操到达底部中间位置）
            if (id === 'caocao' && newPosition.y === BOARD_HEIGHT - 2 && newPosition.x === 1) {
                setIsGameWon(true);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.board, { width: GRID_SIZE * BOARD_WIDTH, height: GRID_SIZE * BOARD_HEIGHT }]}>
                {blocks.map(block => (
                    <Block
                        key={block.id}
                        block={block}
                        onMove={handleMove}
                        gridSize={GRID_SIZE}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    board: {
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: '#333',
        position: 'relative',
    },
});
