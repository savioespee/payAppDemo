import { rgba } from 'polished';

import styles from '../../styles';
import Text from '../Text';

export default function CenteredAdminMessage({ message }) {
  return (
    <Text
      style={[
        styles.textXSmall,
        {
          marginTop: 8,
          paddingHorizontal: 16,
          textAlign: 'center',
          color: rgba('black', 0.7),
        },
      ]}
    >
      {message}
    </Text>
  );
}
