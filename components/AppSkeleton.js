import { StyleSheet, View } from 'react-native';

import CircleProgress from './CircleProgress';

export default function AppSkeleton() {
  return (
    <View style={componentStyles.container}>
      <View style={componentStyles.loadingWrapper}>
        <CircleProgress size={32} />
      </View>
    </View>
  );
}

const componentStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 52,
  },
});
