import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";


class UserPermissions {
  getCameraPermission = async () => {
    if (Constants.platform.os || Constants.platform.android) {
      const { status } = ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === false) {
        alert('Permission to access camera roll is required!');
        return;
      }
    }
  };
}
export default new UserPermissions();
