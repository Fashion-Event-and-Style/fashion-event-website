import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebaseConfig"; // Correctly import storage from firebaseConfig

export const uploadImage = async (userId, file, fileName, subFolder = "wardrobe") => {
  try {
    const storageRef = ref(storage, `users/${userId}/${subFolder}/${fileName}`); // Use storage here

    let fileBlob;
    if (file instanceof Blob) {
      fileBlob = file;
    } else {
      const response = await fetch(file.uri);
      fileBlob = await response.blob();
    }

    const snapshot = await uploadBytes(storageRef, fileBlob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      url: downloadURL,
      path: snapshot.ref.fullPath,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error };
  }
};

export const deleteWardrobeImage = async (imagePath) => {
  try {
    const storageRef = ref(storage, imagePath); // Use storage here
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, error };
  }
};
