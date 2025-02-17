import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const uploadFile = async (file) => {
  const storageRef = ref(Storage, file.name);
  const response = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(response.ref);
  return downloadURL;
};
export default uploadFile;
