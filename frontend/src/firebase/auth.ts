import { auth } from "../../src/firebase/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updatePassword,
    signOut,
    sendEmailVerification,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (
    email: string,
    password: string
) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async (
    email: string,
    password: string
) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result;
};

export const doSignOut = async () => {
    return signOut(auth);
};

//--------------- no están siendo usados en este momento----------------↓
export const doPasswordReset = async (email: string) => {
    return sendPasswordResetEmail(auth, email);
};

export const doPasswordUpdate = async (password: string) => {
    if (auth.currentUser) {
        return updatePassword(auth.currentUser, password);
    }
    throw new Error("No authenticated user found");
};

export const doSendEmailVerification = () => {
    if (auth.currentUser) {
        return sendEmailVerification(auth.currentUser, {
            url: `${window.location.origin}/home`,
        });
    }
    throw new Error("No authenticated user found");
};

export const getAuthToken = async () => {
    const user = auth.currentUser;
    
    if (user) {
        try {
            //pillamos el token de Firebase
            const token = await user.getIdToken(true); 
            //aquí añadimos dentro de () true para forzar siempre la actualización del token
            //la vida del token de firebase es de 1h
            return token;
        } catch (error) {
            console.error("Error getting the token:", error);
        }
    }
    return null;
};
//--------------- no están siendo usados en este momento----------------↑
