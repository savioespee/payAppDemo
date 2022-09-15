import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import alert from '../../utils/alert';
import { sendbird } from '../../utils/sendbird';

export default async function openImagePicker(onFileSelected) {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted === false) {
    alert('Permission to access camera roll is required!');
    return;
  }

  const pickerResult = await ImagePicker.launchImageLibraryAsync();

  if (pickerResult.cancelled === true) {
    return;
  }

  const fileSize = (await FileSystem.getInfoAsync(pickerResult.uri)).size;

  const params = new sendbird.FileMessageParams();
  params.file = {
    size: fileSize,
    uri: pickerResult.uri,
    name: pickerResult.uri.split('/').pop(),
    type: pickerResult.type,
  };
  params.thumbnailSizes = [
    { maxWidth: 100, maxHeight: 100 },
    { maxWidth: 200, maxHeight: 200 },
  ];

  onFileSelected(params);
}
