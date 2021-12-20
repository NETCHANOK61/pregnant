import firebase from "firebase";
import { Alert } from "react-native";
import FirebaseKeys from "../Config";
import firestore from "firebase/firestore";

class Fire {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(FirebaseKeys);
    }
  }
  addPost = async ({ text, localUri }) => {
    // รอรอให้อัปโหลดรูปลง storage ก่อน จึงจะเพิ่มโพสต์ได้
    const remoteUri = await this.uploadPhotoAsync(
      localUri,
      // path ใน storage
      `photos/${this.uid}/${Date.now()}`
    );

    return new Promise((res, rej) => {
      const ref = this.firestore.collection("users").doc(this.uid);
      ref
        .collection("posts")
        .add({
          text,
          timestamp: this.timestamp,
          image: remoteUri,
        })
        .then((ref) => {
          res(ref);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  // อัปโหลดรูปลง storage
  uploadPhotoAsync = async (uri, filename) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();
      let upload = firebase.storage().ref(filename).put(file);
      upload.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };

  // สร้าง user
  createUser = async (user) => {
    let remoteUri = null;
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(async (result) => {
          if (result) {
            const userRef = this.firestore
              .collection("users")
              .doc(result.user.uid);
            const doc = await userRef.get();
            if (!doc.data()) {
              await userRef.set({
                uid: result.user.uid,
                name: user.name,
                email: result.user.email,
                avatar: null,
              });
              if (user.avatar) {
                remoteUri = await this.uploadPhotoAsync(
                  user.avatar,
                  // path ใน storage
                  `avatars/${this.uid}`
                );
                userRef.set({ avatar: remoteUri }, { merge: true });
              }
            }
          }
        });
    } catch (error) {
      alert("Error: ", error);
    }
  };

  // ลบรูปใน storage
  deleteFireStoreData = (postId) => {
    const ref = this.firestore.collection("users").doc(this.uid);
    ref
      .collection("posts")
      .doc(postId)
      .delete()
      .then(() => {
        Alert.alert(
          "ดำเนินการเสร็จสิ้น!",
          "เราได้ลบโพสต์ของคุณออกจากระบบเรียบร้อยแล้ว",
          [{ text: "รับทราบ" }]
        );
      })
      .catch((e) => console.log("เกิดข้อผิดพลาด ไม่สามารถลบโพสต์นี้ได้", e));
  };

  // ลบโพสต์ 
  deletePost = (postId) => {
    console.log("Now post ", postId);
    const ref = this.firestore.collection("users").doc(this.uid);
    ref
      .collection("posts")
      .doc(postId)
      .get()
      .then((documentSnapshort) => {
        if (documentSnapshort.exists) {
          const { image } = documentSnapshort.data();
          if (image != null) {
            const storageRef = firebase.storage().refFromURL(image);
            const imgRef = firebase.storage().ref(storageRef.fullPath);
            imgRef
              .delete()
              .then(() => {
                console.log(`${image} has been delete successfully`);
                this.deleteFireStoreData(postId);
              })
              .catch((e) => {
                console.log("error", e);
              });
          }
        }
      });
  };
  signOutUser = () => {
    firebase.auth().signOut();
  };

  get firestore() {
    return firebase.firestore();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return Date.now();
  }
}

Fire.shared = new Fire();
export default Fire;
