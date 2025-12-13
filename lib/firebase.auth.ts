import { firebaseClientApp } from "./firebase.config";
import { getAuth } from "firebase/auth";

export const auth = getAuth(firebaseClientApp);