import React, { useRef, useEffect } from 'react';
import { StyleSheet, Animated, PanResponder, Text, View, Image } from 'react-native';
import type { Block as BlockType } from '../types';

// 导入图片
import caocaoImage from '../assets/caocao.png';
import zhangfeiImage from '../assets/zhangfei.png';
import guanyuImage from '../assets/guanyu.png';
import bing1Image from '../assets/bing1.png';
import bing2Image from '../assets/bing2.png';
import bing3Image from '../assets/bing3.png';
import bing4Image from '../assets/bing4.png';
import huangzhongImage from '../assets/huangzhong.png';
import zhaoyunImage from '../assets/zhaoyun.png';
import machaoImage from '../assets/machao.png';

interface BlockProps {
    block: BlockType;
    onMove: (id: string, newPosition: { x: number; y: number }) => void;
    gridSize: number;
}

export const Block: React.FC<BlockProps> = ({ block, onMove, gridSize }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const lastValidPosition = useRef(block.position);

    useEffect(() => {
        lastValidPosition.current = block.position;
        pan.setValue({ x: 0, y: 0 });
    }, [block.position]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value
                });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: (_, gesture) => {
                const dx = gesture.dx;
                const dy = gesture.dy;
                if (Math.abs(dx) > Math.abs(dy)) {
                    pan.x.setValue(dx);
                    pan.y.setValue(0);
                } else {
                    pan.x.setValue(0);
                    pan.y.setValue(dy);
                }
            },
            onPanResponderRelease: (_, gesture) => {
                pan.flattenOffset();
                const dx = gesture.dx;
                const dy = gesture.dy;
                const threshold = gridSize * 0.3;
                let newPosition = { ...lastValidPosition.current };
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (Math.abs(dx) > threshold) {
                        newPosition.x += dx > 0 ? 1 : -1;
                    }
                } else {
                    if (Math.abs(dy) > threshold) {
                        newPosition.y += dy > 0 ? 1 : -1;
                    }
                }
                onMove(block.id, newPosition);
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                    friction: 7
                }).start();
            }
        })
    ).current;

    // 根据角色类型选择背景图片
    const backgroundImage = 
        block.type === 'caocao' ? caocaoImage :
        block.type === 'zhangfei' ? zhangfeiImage :
        block.type === 'guanyu' ? guanyuImage :
        block.type === 'bing1' ? bing1Image :
        block.type === 'bing2' ? bing2Image :
        block.type === 'bing3' ? bing3Image :
        block.type === 'bing4' ? bing4Image :
        block.type === 'huangzhong' ? huangzhongImage :
        block.type === 'zhaoyun' ? zhaoyunImage :
        block.type === 'machao' ? machaoImage :
        null;

    const blockStyle = {
        position: 'absolute',
        width: block.width * gridSize,
        height: block.height * gridSize,
        transform: [
            { translateX: block.position.x * gridSize },
            { translateY: block.position.y * gridSize },
            ...pan.getTranslateTransform()
        ]
    };

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.block,
                blockStyle,
            ]}
        >
            <Image source={backgroundImage} style={{ width: '100%', height: '100%', position: 'absolute' }} />
            <Text style={styles.blockText}>{block.name}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    block: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#F5F5DC', // 米色边框
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Android上的阴影效果
    },
    blockText: {
        position: 'absolute',
        bottom: 5, // 距离底部5个单位
        right: 5,  // 距离右侧5个单位
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    }
});
