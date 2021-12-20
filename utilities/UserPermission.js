import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";


class UserPermissions {
  getAllCameraPermission = async () => {
    if (Constants.platform.ios || Constants.platform.android) {
      const { status } = ImagePicker.requestMediaLibraryPermissionsAsync();
      const { granted } = await Camera.requestPermissionsAsync();
      if (status === false) {
        alert('Permission to access camera roll is required!');
        return;
      }
      else if(granted === false){
        alert('Permission to access camera is required!');
      }
    }
  };
}
export default new UserPermissions();
