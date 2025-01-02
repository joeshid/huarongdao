import React from 'react';
import { StyleSheet, Animated, PanResponder } from 'react-native';
import type { Block as BlockType } from '../types';

interface BlockProps {
    block: BlockType;
    onMove: (id: string, newPosition: { x: number; y: number }) => void;
    gridSize: number;
}

export const Block: React.FC<BlockProps> = ({ block, onMove, gridSize }) => {
    const pan = React.useRef(new Animated.ValueXY()).current;

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, gesture) => {
                const newX = Math.round(gesture.moveX / gridSize) * gridSize;
                const newY = Math.round(gesture.moveY / gridSize) * gridSize;
                
                onMove(block.id, { 
                    x: newX / gridSize, 
                    y: newY / gridSize 
                });
                
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;

    const blockStyle = {
        width: block.width * gridSize,
        height: block.height * gridSize,
        transform: [
            { translateX: block.position.x * gridSize },
            { translateY: block.position.y * gridSize },
        ],
        backgroundColor: block.type === 'caocao' ? '#ff4d4d' : 
                        block.type === 'general' ? '#4d94ff' : '#66cc66',
    };

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[styles.block, blockStyle]}
        />
    );
};

const styles = StyleSheet.create({
    block: {
        position: 'absolute',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
    },
});
