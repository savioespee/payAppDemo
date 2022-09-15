import { StyleSheet, View } from 'react-native';

import { BUBBLE_PADDING } from '../../constants';
import useThemeValues from '../../hooks/useThemeValues';
import styles from '../../styles';
import Text from '../Text';

export default function CouldNotRecognizeMessage({ children }: { children: string }) {
  const theme = useThemeValues();
  return (
    <View style={[componentStyles.container, { backgroundColor: theme.adminMessageBoxBackground }]}>
      <Text style={styles.textSmedium}>
        <Text style={[styles.textBold]}>Admin: </Text>
        <Text>{children}</Text>
      </Text>
    </View>
  );
}

const componentStyles = StyleSheet.create({
  container: {
    borderRadius: 6,
    paddingHorizontal: BUBBLE_PADDING,
    paddingVertical: BUBBLE_PADDING / 2,
    marginHorizontal: BUBBLE_PADDING,
  },
});
