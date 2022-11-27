import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from "./firebase"


const uploadAndGetImage = async (path, file) => {
  return await uploadBytesResumable(ref(storage, path), file, { contentType: 'image/jpeg' })
    .then(async () => {
      return await getDownloadURL(ref(storage, path))
    })
}


export {
  uploadAndGetImage
}