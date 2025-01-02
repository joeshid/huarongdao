import React from 'react';
import { StyleSheet, Animated, PanResponder, Image, View, Text } from 'react-native';
import type { Block as BlockType } from '../types';

interface BlockProps {
    block: BlockType;
    onMove: (id: string, newPosition: { x: number; y: number }) => void;
    gridSize: number;
}

export const Block: React.FC<BlockProps> = ({ block, onMove, gridSize }) => {
    console.log('Rendering block:', block.name, 'with props:', { block, onMove, gridSize });
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

    const getImageSource = () => {
        let source;
        switch (block.name) {
            case '曹操':
                source = require('../assets/caocao.png');
                console.log('Loading caocao.png:', source);
                break;
            case '张飞':
                source = require('../assets/zhangfei.png');
                console.log('Loading zhangfei.png:', source);
                break;
            case '关羽':
                source = require('../assets/guanyu.png');
                console.log('Loading guanyu.png:', source);
                console.log('guanyu.png path:', require.resolve('../assets/guanyu.png'));
                break;
            case '黄忠':
                source = require('../assets/huangzhong.png');
                break;
            case '赵云':
                source = require('../assets/zhaoyun.png');
                break;
            case '马超':
                source = require('../assets/machao.png');
                break;
            case '兵1':
                source = require('../assets/bing1.png');
                break;
            case '兵2':
                source = require('../assets/bing2.png');
                break;
            case '兵3':
                source = require('../assets/bing3.png');
                break;
            case '兵4':
                source = require('../assets/bing4.png');
                break;
            default:
                source = require('../assets/block.png'); // 使用默认图片
        }
        return source;
    };

    const blockStyle = {
        width: block.width * gridSize,
        height: block.height * gridSize,
        transform: [
            { translateX: block.position.x * gridSize },
            { translateY: block.position.y * gridSize },
        ],
    };

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[styles.block, blockStyle]}
        >
            {getImageSource() && (
                <Image
                    source={getImageSource()}
                    style={{ 
                        width: '100%', 
                        height: '100%',
                        overflow: 'hidden'
                    }}
                    resizeMode="cover"
                    onLoad={() => console.log('图片加载成功:', block.name)}
                    onError={(e) => {
                        console.error('图片加载失败:', block.name, e.nativeEvent.error);
                        return (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>
                                    无法加载图片: {block.name}
                                </Text>
                            </View>
                        );
                    }}
                />
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    block: {
        position: 'absolute',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffebee',
    },
    errorText: {
        color: '#c62828',
        fontSize: 12,
        textAlign: 'center',
    },
});
