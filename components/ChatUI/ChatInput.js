import { Platform, StyleSheet, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { colors, maskOptions } from '../../constants';
import MultiLineTextInput from '../MultiLineTextInput';

export default function ChatInput({ inputType, textInputProps }) {
  const inputProps = {
    ...textInputProps,
    style: StyleSheet.flatten([_styles.textInput, textInputProps.style]),
  };

  return (
    <View style={[_styles.inputWrapper]}>
      {inputType === 'money' ? (
        <TextInputMask {...inputProps} keyboardType="numeric" type="money" options={maskOptions} />
      ) : (
        <MultiLineTextInput {...inputProps} />
      )}
    </View>
  );
}

const _styles = StyleSheet.create({
  inputWrapper: {
    flex: 1,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: colors.messageInputBackground,
    padding: 4,
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    marginEnd: 8,
    ...Platform.select({
      ios: { marginBottom: 8 },
      default: { marginVertical: 4 },
    }),
    fontSize: 14,
    lineHeight: 21,
    maxHeight: 105,
    paddingVertical: 0,
  },
});
