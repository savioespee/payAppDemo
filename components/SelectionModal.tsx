import { ReactNode, useState } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import ReactNativeModal from 'react-native-modal';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors } from '../constants';
import styles from '../styles';
import Image from './Image';
import Spacer from './Spacer';
import Text from './Text';

type Layout = 'actionSheet' | 'dialog';

function OptionItem({
  children,
  onPress,
  isSelected,
  layout,
  style,
}: {
  children: string;
  onPress: () => void;
  isSelected: boolean;
  layout: Layout;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      style={({ pressed, hovered }: any) => [
        styles.rowStack,
        layout === 'actionSheet' ? componentStyles.actionSheetOption : componentStyles.dialogOption,
        (pressed || hovered) && { backgroundColor: 'rgba(0, 0, 0, 0.07)' },
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          { flex: 1, fontSize: 16 },
          layout === 'actionSheet' ? componentStyles.actionSheetOptionText : componentStyles.dialogOptionText,
          isSelected && { color: '@accent' },
        ]}
      >
        {children}
      </Text>
      {isSelected && (
        <Image source={require('../assets/ic-done.png')} style={{ width: 24, height: 24, tintColor: '@accent' }} />
      )}
    </Pressable>
  );
}

function CancelButton({ onPress }: { onPress: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value) }],
  }));

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPressIn={() => {
        setIsHovered(true);
        scale.value = 0.98;
      }}
      onPressOut={() => {
        setIsHovered(false);
        scale.value = 1;
      }}
      onPress={onPress}
    >
      <Animated.View style={[animatedStyle, { borderRadius: 14, overflow: 'hidden', backgroundColor: 'white' }]}>
        <Text
          style={[
            {
              fontSize: 16,
              color: '@accent',
              textAlign: 'center',
              paddingHorizontal: 24,
              paddingVertical: 16,
            },
            isHovered && { backgroundColor: 'rgba(0, 0, 0, 0.07)' },
          ]}
        >
          Cancel
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function SelectionModal({
  options,
  selectedOption,
  onSelect,
  isVisible,
  onCancel,
  title,
  layout,
}: {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  isVisible: boolean;
  onCancel: () => void;
  title: string;
  layout: 'actionSheet' | 'dialog';
}) {
  const renderBody = (children: ReactNode) => {
    if (layout === 'actionSheet') {
      return <View style={componentStyles.actionSheetBody}>{children}</View>;
    }
    return (
      <View style={componentStyles.dialogBody}>
        {children}
        <Spacer size={8} />
      </View>
    );
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      backdropColor="rgba(0, 0, 0, 0.32)"
      style={layout === 'actionSheet' ? componentStyles.actionSheetContainer : componentStyles.dialogContainer}
    >
      {renderBody(
        <>
          <View style={layout === 'actionSheet' ? componentStyles.actionSheetTitle : componentStyles.dialogTitle}>
            <Text
              style={layout === 'actionSheet' ? componentStyles.actionSheetTitleText : componentStyles.dialogTitleText}
            >
              {title}
            </Text>
          </View>
          {options.map((option, index) => (
            <OptionItem
              key={option}
              isSelected={option === selectedOption}
              layout={layout}
              onPress={() => onSelect(option)}
              style={
                index > 0 && {
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(0, 0, 0, 0.12)',
                }
              }
            >
              {option}
            </OptionItem>
          ))}
        </>,
      )}
      {layout === 'actionSheet' && (
        <>
          <Spacer size={8} />
          <CancelButton onPress={onCancel} />
        </>
      )}
    </ReactNativeModal>
  );
}

const componentStyles = StyleSheet.create({
  actionSheetContainer: {
    marginHorizontal: 8,
    marginBottom: isIphoneX() ? 48 : 8,
    justifyContent: 'flex-end',
  },
  dialogContainer: { alignItems: 'center' },
  actionSheetBody: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  dialogBody: {
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'white',
    minWidth: 280,
  },
  actionSheetTitle: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.12)',
  },
  dialogTitle: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  actionSheetTitleText: StyleSheet.flatten([
    styles.textSmedium,
    styles.textSemibold,
    {
      color: 'rgba(0, 0, 0, 0.5)',
      textAlign: 'center',
    },
  ]),
  dialogTitleText: {
    fontSize: 18,
    fontWeight: '500',
  },
  actionSheetOption: { paddingHorizontal: 24, paddingVertical: 16 },
  dialogOption: { paddingHorizontal: 24, paddingVertical: 12 },
  actionSheetOptionText: { fontWeight: '500' },
  dialogOptionText: { fontWeight: '400' },
});
