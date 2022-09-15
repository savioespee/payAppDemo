import { useCallback } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../constants';
import styles from '../styles';
import { getChannelTitle } from '../utils/common';
import Avatar from './Avatar';
import Button from './Button';
import ChannelCover from './ChannelCover';
import Spacer from './Spacer';
import Text from './Text';

function ShareListItem({ item, disabled, onSharePress }) {
  const isChannel = typeof item.url === 'string';
  const avatar = isChannel ? <ChannelCover channel={item} size={48} /> : <Avatar size={48} user={item} />;
  const title = isChannel ? getChannelTitle({ channel: item }) : item.nickname;
  return (
    <View style={[styles.rowStack, { paddingHorizontal: 16, alignItems: 'center' }]}>
      {avatar}
      <View style={[styles.colStack, { marginHorizontal: 12, flex: 1 }]}>
        <Text style={[{ fontSize: 16 }, styles.textBold]}>{title}</Text>
        {isChannel ? null : <Text style={[styles.textSmall, { color: colors.secondaryText }]}>{item.userId}</Text>}
      </View>
      <Button title="Share" rounded size="small" disabled={disabled} onPress={onSharePress} />
    </View>
  );
}

export default function ShareModal({ title = 'Share with', isVisible, setIsVisible, shareTargets, onSelect }) {
  const { height: screenHeight } = useWindowDimensions();
  return (
    <ReactNativeModal
      isVisible={isVisible}
      backdropOpacity={0.32}
      onBackdropPress={() => setIsVisible(false)}
      style={[_styles.container, { marginTop: screenHeight - 411 }]}
    >
      <View style={_styles.header}>
        <Text style={_styles.headerText}>{title}</Text>
      </View>
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <FlatList
          data={shareTargets}
          keyExtractor={(item, index) => item.userId || item.url || `index-${index}`}
          renderItem={({ item, index }) => (
            <ShareListItem item={item} disabled={index > 0} onSharePress={() => onSelect(item)} />
          )}
          ItemSeparatorComponent={useCallback(
            () => (
              <Spacer size={20} />
            ),
            [],
          )}
          style={_styles.list}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        />
      </SafeAreaView>
    </ReactNativeModal>
  );
}

const _styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    margin: 0,
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  header: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: StyleSheet.flatten([styles.textMedium, styles.textBold]),
  list: {},
});
