import { firebaseClientApp } from "./firebase.config";
import { getStorage } from "firebase/storage";

export const storage = getStorage(firebaseClientApp);