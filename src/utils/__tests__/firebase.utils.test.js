import fireStoreAuth from "firebase/auth";
import { 
    signInWithGooglePopup, 
    signInWithGoogleRedirect, 
    signInAuthUserWithEmailAndPassword,
    createAuthUserWithEmailAndPassword,
    signOutUser
} from '../firebase/firebase.utils';

jest.mock('firebase/auth', () => {
    return {
      getAuth: jest.fn(),
      GoogleAuthProvider: jest.fn().mockImplementation(() => {
        return {
          setCustomParameters: jest.fn(),
        };
      }),
      signInWithPopup: jest.fn(),
      signInWithRedirect: jest.fn(),
      signInWithEmailAndPassword: jest.fn(),
      createUserWithEmailAndPassword: jest.fn(),
      onAuthStateChanged: jest.fn(),
      signOut: jest.fn(),
    };
  });

describe('firebase utils tests', () => {
    test("signInWithGooglePopup to call firestoreAuth's signInWithPopup", () => {
        signInWithGooglePopup();
        expect(fireStoreAuth.signInWithPopup).toHaveBeenCalled();
    });

    test("signInWithGoogleRedirect to call firestoreAuth's signInWithRedirect", () => {
        signInWithGoogleRedirect();
        expect(fireStoreAuth.signInWithRedirect).toHaveBeenCalled();
    });
    
    test("signInAuthUserWithEmailAndPassword to call firestoreAuth's signInWithEmailAndPassword", () => {
        const testEmail = 'testEmail';
        const testPassword = 'testPassword';
        signInAuthUserWithEmailAndPassword(testEmail, testPassword);
        expect(fireStoreAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
            undefined,
            testEmail,
            testPassword
        );
    });

    test("createAuthUserWithEmailAndPassword to call firestoreAuth's createUserithEmailAndPassword", () => {
        const testEmail = 'testEmail';
        const testPassword = 'testPassword';
        createAuthUserWithEmailAndPassword(testEmail, testPassword);
        expect(fireStoreAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
            undefined,
            testEmail,
            testPassword
        );
    });

    test("signOutUser to call firestoreAuth's, signOut", () => {
        signOutUser();
        expect(fireStoreAuth.signOut).toHaveBeenCalled();
    })
})

