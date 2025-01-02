import React from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Block } from './Block';
import { useGameState } from '../hooks/useGameState';
import type { Block as BlockType } from '../types';

const windowWidth = Dimensions.get('window').width;
const BOARD_WIDTH = Math.min(windowWidth * 0.9, 400);
const GRID_SIZE = BOARD_WIDTH / 4;

const initialBlocks: BlockType[] = [
    { 
        id: 'caocao', 
        width: 2, 
        height: 2, 
        position: { x: 1, y: 0 }, 
        type: 'caocao', 
        name: '曹操'
    },
    { 
        id: 'zh', 
        width: 1, 
        height: 2, 
        position: { x: 0, y: 0 }, 
        type: 'general', 
        name: '张辽'
    },
    { 
        id: 'gy', 
        width: 1, 
        height: 2, 
        position: { x: 3, y: 0 }, 
        type: 'general', 
        name: '关羽'
    },
    { 
        id: 'mc1', 
        width: 1, 
        height: 1, 
        position: { x: 0, y: 2 }, 
        type: 'soldier', 
        name: '兵1'
    },
    { 
        id: 'mc2', 
        width: 1, 
        height: 1, 
        position: { x: 1, y: 2 }, 
        type: 'soldier', 
        name: '兵2'
    },
    { 
        id: 'mc3', 
        width: 1, 
        height: 1, 
        position: { x: 2, y: 2 }, 
        type: 'soldier', 
        name: '兵3'
    },
    { 
        id: 'mc4', 
        width: 1, 
        height: 1, 
        position: { x: 3, y: 2 }, 
        type: 'soldier', 
        name: '兵4'
    },
    { 
        id: 'hz', 
        width: 2, 
        height: 1, 
        position: { x: 1, y: 3 }, 
        type: 'general', 
        name: '黄忠'
    },
    { 
        id: 'zy', 
        width: 1, 
        height: 2, 
        position: { x: 0, y: 3 }, 
        type: 'general', 
        name: '赵云'
    },
    { 
        id: 'ma', 
        width: 1, 
        height: 2, 
        position: { x: 3, y: 3 }, 
        type: 'general', 
        name: '马超'
    }
];

export const Board: React.FC = () => {
    const { blocks, moveCount, isGameWon, handleMove, resetGame } = useGameState(initialBlocks);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>华容道</Text>
            <View style={styles.board}>
                <View style={styles.grid}>
                    {Array(6).fill(0).map((_, i) => (
                        <View key={`h${i}`} style={[styles.gridLine, styles.horizontalLine, { top: i * GRID_SIZE }]} />
                    ))}
                    {Array(5).fill(0).map((_, i) => (
                        <View key={`v${i}`} style={[styles.gridLine, styles.verticalLine, { left: i * GRID_SIZE }]} />
                    ))}
                </View>
                {blocks.map(block => (
                    <Block
                        key={block.id}
                        block={block}
                        onMove={handleMove}
                        gridSize={GRID_SIZE}
                    />
                ))}
            </View>
            <View style={styles.info}>
                <Text style={styles.moveCount}>移动次数: {moveCount}</Text>
                {isGameWon && <Text style={styles.winText}>恭喜过关！</Text>}
                <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                    <Text style={styles.resetText}>重新开始</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    board: {
        width: BOARD_WIDTH,
        height: BOARD_WIDTH * 1.25,
        backgroundColor: '#fff',
        borderRadius: 10,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    grid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    gridLine: {
        position: 'absolute',
        backgroundColor: '#ddd',
    },
    horizontalLine: {
        left: 0,
        right: 0,
        height: 1,
    },
    verticalLine: {
        top: 0,
        bottom: 0,
        width: 1,
    },
    info: {
        marginTop: 20,
        alignItems: 'center',
    },
    moveCount: {
        fontSize: 18,
        marginBottom: 10,
    },
    winText: {
        fontSize: 24,
        color: '#4CAF50',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    resetButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    resetText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
