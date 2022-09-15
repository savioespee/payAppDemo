import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { darken, rgba } from 'polished';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { core, localImageMap } from '../constants';
import useThemeValues from '../hooks/useThemeValues';
import CircleProgress from './CircleProgress';
import Image from './Image';
import Text from './Text';

const Carousel = ({
  onItemSelect,
  data = [],
}: {
  onItemSelect?: (item: CarouselItem) => void;
  data?: CarouselItem[];
}) => {
  const theme = useThemeValues();
  const [loadingItemIndex, setLoadingItemIndex] = useState(-1);
  const hasSelectedItem = data.some((item) => item.isSelected);

  const handleItemSelect = async ({ item, index }) => {
    setLoadingItemIndex(index);
    try {
      await onItemSelect?.(item);
    } finally {
      setLoadingItemIndex(-1);
    }
  };

  const renderItemContent = (item: CarouselItem) => {
    if (item.type === 'image') {
      return (
        <>
          <Image
            source={localImageMap[item.localImageName!]}
            style={{
              width: 148,
              height: 126,
              backgroundColor: 'white',
              alignSelf: 'center',
            }}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Text
              numberOfLines={2}
              style={[
                {
                  fontSize: 12,
                  marginVertical: 8,
                  paddingHorizontal: 10,
                },
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                paddingHorizontal: 10,
              }}
            >
              {item.price}
            </Text>
          </View>
        </>
      );
    }

    return (
      <View
        style={{
          width: 148,
          height: 126,
          backgroundColor: item.backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 24,
            lineHeight: 28,
            fontWeight: '700',
            marginHorizontal: 16,
            color: 'white',
            textAlign: 'center',
          }}
        >
          {item.name}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      data={data}
      pagingEnabled={true}
      contentContainerStyle={{
        paddingVertical: 4,
        paddingLeft: 50,
        paddingRight: 14,
      }}
      keyExtractor={(item) => item.name}
      renderItem={({ item, index }) => (
        <View
          style={[
            {
              display: 'flex',
              borderRadius: 16,
              marginHorizontal: 2.5,
              backgroundColor: '#F2F4F6',
              width: 150,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#D9D9D9',
            },
          ]}
        >
          {renderItemContent(item)}
          <Pressable
            style={({ pressed }) => ({
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              borderTopWidth: 1,
              alignSelf: 'stretch',
              borderColor: rgba('black', 0.12),
              backgroundColor: pressed ? darken(0.02, '#F2F4F6') : '#F2F4F6',
            })}
            onPress={() => handleItemSelect({ item, index })}
            disabled={hasSelectedItem || loadingItemIndex > -1}
          >
            {index === loadingItemIndex ? (
              <View
                style={{
                  width: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircleProgress size={20} />
              </View>
            ) : item.isSelected ? (
              <MaterialIcons name="done" size={24} color={theme.accent} />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: hasSelectedItem ? core.content.disabled : '@accent',
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                {item.buttonLabel || 'Select'}
              </Text>
            )}
          </Pressable>
        </View>
      )}
    />
  );
};

export default Carousel;
