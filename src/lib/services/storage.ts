import {ref, uploadBytes} from "firebase/storage";
import {firebase, firebaseConfig} from "@/lib/firebase/common";
import {awaitCurrentUser} from "@/lib/services/auth";

export async function uploadImage(file: File) {
  const contentType = file.type;
  if (!contentType?.startsWith("image/")) {
    console.error("File is not an image:", contentType);
    return null;
  }

  if (!firebase.storage) {
    console.error("Firebase storage not available");
    return null;
  }

  const user = await awaitCurrentUser();
  if (!user) {
    console.error("User must be logged in to upload files");
    return null;
  }

  const uniqueName = `${crypto.randomUUID()}.${getFileExtension(file.name)}`;
  const storagePath = `users/${user.uid}/${uniqueName}`
  const storageRef = ref(firebase.storage, storagePath);

  const metadata = {
    contentType,
    customMetadata: {
      originalName: file.name // Save original name in metadata for reference later
    }
  };

  try {
    await uploadBytes(storageRef, file, metadata);
    return getPublicUrl(storagePath);
  } catch (error) {
    console.error("Upload failed", error);
  }
  return null;
}

function getFileExtension(filename: string) {
  const parts = filename.split('.');

  // Handle cases with no extension or hidden files (e.g. ".hidden")
  if (parts.length < 2 || (parts.length === 2 && parts[0] === "")) {
    return "";
  }
  return parts.pop()!;
}

function getPublicUrl(path: string) {
  const bucket = firebaseConfig.storageBucket;
  const encodedPath = encodeURIComponent(path);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;
}
