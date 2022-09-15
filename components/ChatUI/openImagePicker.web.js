import * as ImagePicker from 'expo-image-picker';

import { sendbird } from '../../utils/sendbird';

const processBase64 = (base64String) => {
  return new Promise((resolve, reject) => {
    fetch(base64String)
      .then((response) => response.blob())
      .then((blob) => {
        resolve(new File([blob], 'test.jpeg', { type: 'image/jpeg' }));
      });
  });
};

export default async function openImagePicker(onFileSelected) {
  const pickerResult = await ImagePicker.launchImageLibraryAsync();

  if (pickerResult.cancelled === true) {
    return;
  }

  const params = new sendbird.FileMessageParams();
  params.file = await processBase64(pickerResult.uri);
  params.thumbnailSizes = [
    { maxWidth: 100, maxHeight: 100 },
    { maxWidth: 200, maxHeight: 200 },
  ];

  onFileSelected(params);
}
