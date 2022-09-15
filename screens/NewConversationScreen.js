import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect, useState } from 'react';
import { Alert, FlatList, Platform, View } from 'react-native';
import { useQuery } from 'react-query';

import Avatar from '../components/Avatar';
import HeaderTextButton from '../components/HeaderTextButton';
import ListItem from '../components/ListItem';
import Spacer from '../components/Spacer';
import Text from '../components/Text';
import { colors, USER_METADATA_KEYS } from '../constants';
import useThemeValues from '../hooks/useThemeValues';
import styles from '../styles';
import { sendbird } from '../utils/sendbird';

export default function NewConversationScreen() {
  const theme = useThemeValues();
  const navigation = useNavigation();
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const { data } = useQuery('users', () => {
    const listQuery = sendbird.createApplicationUserListQuery();
    listQuery.metaDataKeyFilter = USER_METADATA_KEYS.userType;
    listQuery.metaDataValuesFilter = ['friend'];
    listQuery.limit = 100;

    return new Promise((resolve, reject) => {
      listQuery.next((users, error) => {
        if (error) {
          return reject(error);
        }
        resolve(users);
      });
    });
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'New conversation',
      headerTitleAlign: 'center',
      headerShadowVisible: true,
      headerBackImage: ({ tintColor }) => <MaterialIcons name="arrow-back-ios" size={24} color={tintColor} />,
      headerRight: () => (
        <View style={styles.rowStack}>
          <HeaderTextButton
            title="Create"
            disabled={selectedUserIds.length === 0}
            onPress={() => {
              sendbird.GroupChannel.createChannelWithUserIds(
                selectedUserIds,
                true,
                '',
                '',
                '',
                '',
                (groupChannel, error) => {
                  if (error) {
                    Alert.alert('Error', error.message);
                    return;
                  }
                  const channelUrl = groupChannel.url;
                  navigation.goBack();
                  navigation.navigate('Chat', { channelUrl });
                },
              );
            }}
          />
          {Platform.OS === 'web' && <Spacer size={16} />}
        </View>
      ),
    });
  }, [navigation, selectedUserIds, selectedUserIds.length]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.userId}
        style={{ backgroundColor: 'white' }}
        contentContainerStyle={{ flex: 1, paddingVertical: 4 }}
        renderItem={({ item }) => (
          <ListItem
            viewStyle={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
            onPress={() =>
              setSelectedUserIds((userIds) => {
                if (userIds.includes(item.userId)) {
                  return userIds.filter((id) => id !== item.userId);
                }
                return [...userIds, item.userId];
              })
            }
          >
            <Avatar user={item} size={60} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.textMedium, { fontWeight: '600' }]}>{item.nickname}</Text>
              <Text style={[styles.textSmall, { color: colors.secondaryText }]}>{item.userId}</Text>
            </View>
            {selectedUserIds.includes(item.userId) ? (
              <MaterialCommunityIcons name="check-circle" size={24} color={theme.accent} />
            ) : (
              <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={24} color={colors.tertiaryText} />
            )}
          </ListItem>
        )}
      />
    </View>
  );
}
