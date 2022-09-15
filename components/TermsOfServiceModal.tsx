import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import ReactNativeModal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../constants';
import styles from '../styles';
import Button from './Button';
import IconButton from './IconButton';
import Text from './Text';

const TERMS_OF_SERVICE =
  'PLEASE CAREFULLY READ THESE CURRENT TERMS AND CONDITIONS GOVERNING YOUR USE OF SENDBIRD’S DOCUMENTATION, PACKAGED SOFTWARE, INCLUDING APPLICATION PROGRAMMING INTERFACE (“API”) OR SOFTWARE DEVELOPER KITS (“SDK”) AS APPLICABLE, AND ANY THIRD PARTY HOSTED CLOUD SERVICE PROVIDERS, INCLUSIVE OF SUCH LIMITATIONS OR OPTIONAL FEATURES AS MAY BE COMMUNICATED TO CUSTOMER AND ANY SUPPORTING SERVICES (“COLLECTIVELY, SENDBIRD SERVICES”).  THIS IS A LEGAL AGREEMENT BETWEEN YOU AND THE LEGAL ENTITY YOU REPRESENT (“CUSTOMER”) AND SENDBIRD, INC. AND ITS SUBSIDIARIES AND AFFILIATES, AS APPLICABLE (“SENDBIRD”).  BY CLICKING THE “I ACCEPT” BUTTON, EXECUTING AN ORDER THAT REFERENCES THIS AGREEMENT, OR BY EITHER ACCESSING OR USING THE SENDBIRD SERVICES, CUSTOMER ACKNOWLEDGES THAT CUSTOMER HAS REVIEWED, UNDERSTANDS, AND ACCEPTS THESE TERMS AND CONDITIONS.  YOU WARRANT AND REPRESENT THAT YOU HAVE THE AUTHORITY TO BIND YOUR LEGAL ENTITY AND “CUSTOMER” REFERS TO THAT ENTITY.  IF CUSTOMER DOES NOT AGREE WITH ALL OF THE TERMS AND CONDITIONS IN THIS AGREEMENT, DO NOT ACCESS OR OTHERWISE USE THE SENDBIRD SERVICES.  BY USING THE SENDBIRD SERVICES, CUSTOMER WARRANTS TO USE BEST EFFORTS TO ENSURE CONTRACTUAL EFFICACY TO ALL TERMS HEREIN. SENDBIRD MAY MAKE CHANGES TO THE SENDBIRD SERVICES OR MODIFY THE TERMS AND CONDITIONS HEREIN AT ANY TIME. CUSTOMER’S CONTINUED USE OF THE SENDBIRD SERVICES AFTER MODIFICATIONS HAVE BEEN POSTED TO SENDBIRD’S WEBSITE WILL SIGNIFY CUSTOMER’S ASSENT TO AND ACCEPTANCE OF THE REVISED TERMS. TO THE EXTENT ANY TERMS OF THIS AGREEMENT DIRECTLY CONFLICT WITH THE TERMS OF ANY FULLY EXECUTED WRITTEN AGREEMENT BETWEEN SENDBIRD AND CUSTOMER (“SUPPLEMENTAL AGREEMENT”), THE SUPPLEMENTAL AGREEMENT SHALL APPLY.';

export default function TermsOfServiceModal({
  isVisible,
  setIsVisible,
  onAgree,
}: {
  isVisible?: boolean;
  setIsVisible: (isVisible: boolean) => void;
  onAgree: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const statusBarHeight = getStatusBarHeight();
  return (
    <ReactNativeModal
      isVisible={isVisible}
      backdropOpacity={0.32}
      onBackdropPress={() => setIsVisible(false)}
      style={[_styles.container, { marginTop: statusBarHeight + 24 }]}
    >
      <View style={_styles.header}>
        <Text style={_styles.headerText}>New Terms of Service</Text>
        <IconButton style={_styles.headerCloseButton} onPress={() => setIsVisible(false)}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </IconButton>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        <Text>{TERMS_OF_SERVICE}</Text>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={{ borderTopWidth: 1, borderColor: colors.border }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
          <Button
            title="Accept"
            variant="primary"
            style={{ marginBottom: 16 }}
            isLoading={isLoading}
            onPress={async () => {
              setIsLoading(true);
              try {
                await onAgree();
              } catch (error) {
                console.error(error);
              } finally {
                setIsLoading(false);
              }
            }}
          />
          <Button title="Remind me later" variant="secondary" onPress={() => setIsVisible(false)} />
        </View>
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
  headerCloseButton: {
    position: 'absolute',
    right: 16,
  },
});
