import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { rgba } from 'polished';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useEvent from '../hooks/useEvent';
import { delay } from '../utils/common';
import IconButton from './IconButton';
import Image from './Image';
import Spacer from './Spacer';

const savedPassword = [1, 2, 3, 4]; // temporary password check
const keyboardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, -1, 0, 'DEL'] as const;

export default function PinPad({ onClose, onPasswordConfirm: onPasswordConfirmProp }) {
  const onPasswordConfirm = useEvent(onPasswordConfirmProp);
  const [password, setPassword] = useState<number[]>([]);

  const _addPassword = (item: number) => {
    if (password.length < savedPassword.length) {
      const temp = [...password, item];
      setPassword(temp);
    }
  };

  const _deletePassword = () => {
    if (password.length !== 0) {
      const temp = [...password];
      temp.splice(-1, 1);
      setPassword(temp);
    }
  };

  useEffect(() => {
    if (password.length === savedPassword.length) {
      delay(500).then(() => {
        onPasswordConfirm(password.join(''));
      });
    }
  }, [onPasswordConfirm, password]);

  return (
    <>
      <BlurView style={styles.container} tint="dark" intensity={100}>
        <View style={styles.topContainer}>
          <IconButton style={{ position: 'absolute', top: 0, left: 0 }} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="white" />
          </IconButton>
          <Text style={styles.titleText}>비밀번호를 눌러주세요</Text>
          <Spacer size={16} />
          <View
            style={{
              flex: 0.1,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              width: '50%',
              flexDirection: 'row',
            }}
          >
            <View style={[styles.passwordDot, { opacity: password.length >= 1 ? 1 : 0.3 }]} />
            <View style={[styles.passwordDot, { opacity: password.length >= 2 ? 1 : 0.3 }]} />
            <View style={[styles.passwordDot, { opacity: password.length >= 3 ? 1 : 0.3 }]} />
            <View style={[styles.passwordDot, { opacity: password.length >= 4 ? 1 : 0.3 }]} />
          </View>
          <Spacer size={32} />
          <View style={{ padding: 8, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 4 }}>
            <Text style={{ fontSize: 13, color: 'white', fontWeight: '500' }}>비밀번호를 몰라요</Text>
          </View>
        </View>
        <View style={styles.middleContainer}>
          <FlatList
            data={keyboardNumbers}
            renderItem={({ item }) =>
              item === -1 ? (
                <View style={styles.item} />
              ) : item === 'DEL' ? (
                <TouchableOpacity style={styles.item} onPress={_deletePassword}>
                  <Image
                    source={require('../assets/ic-delete.png')}
                    style={{ aspectRatio: 0.3, resizeMode: 'contain' }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.item}
                  activeOpacity={0.5}
                  onPress={() => {
                    _addPassword(item);
                  }}
                >
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )
            }
            keyExtractor={(item) => item.toString()}
            numColumns={3}
            scrollEnabled={false}
          />
        </View>
      </BlurView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: rgba('blue', 0.1),
  },
  topContainer: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleContainer: {
    flex: 1,
  },
  bottomContainer: {},
  titleText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 33,
    letterSpacing: 0.0041,
  },
  bodyText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 23,
    letterSpacing: 0.0041,
    marginBottom: 40,
  },
  footerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 23,
    letterSpacing: 0.0041,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 3,
    height: Dimensions.get('window').width / 5, // approximate a square
  },
  itemText: {
    fontWeight: '400',
    color: 'white',
    fontSize: 25,
    lineHeight: 29.83,
  },
  passwordDot: {
    height: 18,
    width: 18,
    borderRadius: 100,
    backgroundColor: 'white',
  },
});
