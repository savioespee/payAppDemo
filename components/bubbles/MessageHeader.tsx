import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '../../constants';
import Spacer from '../Spacer';
import Text from '../Text';
import headerIconMap from './headerIconMap';

function BookmarkIcon() {
  return (
    <Svg width="14" height="14" fill="none" viewBox="0 0 14 14">
      <Path
        fill="#2658B6"
        fillRule="evenodd"
        d="M7.336 2.042a2.379 2.379 0 00-1.846.693l-3.83 3.83c-.923.924-.933 2.411-.022 3.322l2.475 2.475c.91.912 2.398.901 3.322-.022l3.83-3.83a2.379 2.379 0 00.693-1.846l-.162-2.312a2.31 2.31 0 00-2.148-2.148l-2.312-.162zm.489 4.133a1.167 1.167 0 101.65-1.65 1.167 1.167 0 00-1.65 1.65z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

type HeaderType = NonNullable<MessageData['header']>['type'];

export default function MessageHeader({
  title,
  type = 'warning',
  style,
}: {
  title: string;
  type?: HeaderType;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[componentStyles.title, style]}>
      {headerIconMap[type] || <BookmarkIcon />}
      <Spacer size={6} />
      <Text style={componentStyles.titleText}>{title}</Text>
    </View>
  );
}

const componentStyles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});
