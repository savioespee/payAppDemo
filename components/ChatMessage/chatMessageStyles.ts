import { StyleSheet } from 'react-native';

const chatMessageStyles = StyleSheet.create({
  divider: { width: '100%', height: 1, backgroundColor: '#DEDEDE' },
  dateLine: {
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 18,
  },
  avatar: {
    marginHorizontal: 8,
    marginBottom: 3,
  },
  messageRow: {
    display: 'flex',
    paddingHorizontal: 8,
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  messageTextWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default chatMessageStyles;
