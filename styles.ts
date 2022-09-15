import { StyleSheet } from 'react-native';

import { colors } from './constants';

const textStyles = {
  textXLarge: {
    fontSize: 22,
  },
  textLarge: {
    fontSize: 20,
  },
  textMedium: {
    fontSize: 17,
  },
  textSmedium: {
    fontSize: 14,
  },
  textSmall: {
    fontSize: 13,
  },
  textXSmall: {
    fontSize: 12,
  },
  textXXSmall: {
    fontSize: 11,
  },
} as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: colors.text },
  textBold: { fontWeight: '700' },
  textSemibold: { fontWeight: '600' },

  roundButton: {
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: { padding: 8 },

  textInput: {
    ...textStyles.textSmall,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 0,
    height: 52,
  },

  rowStack: { display: 'flex', flexDirection: 'row' },
  colStack: { display: 'flex', flexDirection: 'column' },
  centerChildren: { alignItems: 'center', justifyContent: 'center' },

  headerButtons: {
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  ...textStyles,
});

export default styles;
