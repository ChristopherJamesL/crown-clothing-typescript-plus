import { call } from 'typed-redux-saga/macro';
import { testSaga, expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import {
    userSagas,
    onSignOutStart,
    onSignUpStart,
    onSignUpSuccess,
    onEmailSignInStart,
    onCheckUserSession,
    onGoogleSignInStart,
    signOut,
    signUp,
    signInWithEmail,
    signInWithGoogle,
    isUserAuthenticated,
    signInAfterSignUp,
    getSnapshotFromUserAuth,
} from '../user.saga';
import {
    getCurrentUser,
    createUserDocumentFromAuth,
    signInWithGooglePopup,
    signInAuthUserWithEmailAndPassword,
    createAuthUserWithEmailAndPassword,
    signOutUser,
} from '../../../utils/firebase/firebase.utils';
import { USER_ACTION_TYPES } from '../user.types';
import {
  signOutFailed,
  signOutSuccess,
  signUpSuccess,
  signUpFailed,
  signInFailed,
  signInSuccess,
} from '../user.action';

describe('user saga tests', () => {
    test('userSagas', () => {
        testSaga(userSagas)
            .next()
            .all([
                call(onCheckUserSession),
                call(onGoogleSignInStart),
                call(onEmailSignInStart),
                call(onSignUpStart),
                call(onSignUpSuccess),
                call(onSignOutStart),
            ])
            .next()
            .isDone();
    });

    test('onGoogleSignInStart saga should takeLatest GOOGLE_SIGN_IN_START and call signInWithGoogle', () => {
        testSaga(onGoogleSignInStart)
            .next()
            .takeLatest(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, signInWithGoogle)
            .next()
            .isDone();
    });

    test('onCheckUserSession saga should takeLatest CHECK_USER_SESSION and call isUserAuthenticated', () => {
        testSaga(onCheckUserSession)        
            .next()
            .takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated)
            .next()
            .isDone();
    });

    test('onEmailSignInStart saga should takeLatest EMAIL_SIGN_IN_START and call signInWithEmail', () => {
        testSaga(onEmailSignInStart)
            .next()
            .takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail)
            .next()
            .isDone();
    });

    test('onSignUpStart saga should takeLatest SIGN_UP_START and call signUp', () => {
        testSaga(onSignUpStart)
            .next()
            .takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUp)
            .next()
            .isDone();
    });

    test('onSignUpSuccess saga should takeLatest SIGN_UP_SUCCESS and call signInAfterSignUp', () => {
        testSaga(onSignUpSuccess)
            .next()
            .takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp)
            .next()
            .isDone();
    });

    test('onSignOutStart saga should takeLatest SIGN_OUT_START and call signOut', () => {
        testSaga(onSignOutStart)
            .next()
            .takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut)
            .next()
            .isDone();
    });

    test('signInAfterSignUp saga should call getSnapShotFromUserAuth and sign in', () => {
        const mockUser = {id: 1, name: 'test'};
        const mockAdditionalDetails = { displayname: 'test' };
        const mockPayload = {
            user: mockUser,
            additionalDetails: mockAdditionalDetails
        };

        testSaga(signInAfterSignUp, { payload: mockPayload })
            .next()
            .call(getSnapshotFromUserAuth, mockUser, mockAdditionalDetails)
            .next()
            .isDone();
    });

    test('signOut saga success should call signOutUser and put signOutSuccess if successfull', () => {
        return expectSaga(signOut)
            .provide([[call(signOutUser)]])
            .put(signOutSuccess())
            .run();
    });

    test('signOut saga error should call signOutUser and put signOutFailed', () => {
        const error = new Error('error occured');
        return expectSaga(signOut)
            .provide([[call(signOutUser), throwError(error)]])
            .put(signOutFailed(error))
            .run();
    });

    test('signUp saga dispatches signUpSuccess when createAuthUserWithEmailAndPassword succeeds', () => {
        const mockEmail = 'test';
        const mockPassword = 'test2';
        const mockDisplayName = 'test3';
        const mockUser = { displayName: mockDisplayName, email: mockEmail };
        const mockUserCredential = { id: 1, user: mockUser };
        const mockPayload = {
            email: mockEmail,
            password: mockPassword,
            displayName: mockDisplayName
        };

        return expectSaga(signUp, { payload: mockPayload })
            .provide([
                [call(createAuthUserWithEmailAndPassword, mockEmail, mockPassword), mockUserCredential]
            ])
            .put(signUpSuccess(mockUserCredential.user, { displayName: mockDisplayName }))
            .run();
    });

    test('signUp saga should call createAuthUserWithEmailAndPassword and put signUpFailure if failed', () => {
        const mockError = new Error('error occured');
        const mockEmail = 'test';
        const mockPassword = 'test2';
        const mockDisplayName = 'test3';
        const mockPayload = { email: mockEmail, password: mockPassword, displayName: mockDisplayName };

        return expectSaga(signUp, {payload: mockPayload})
            .provide([
                [call(createAuthUserWithEmailAndPassword, mockEmail, mockPassword), throwError(mockError)]
            ])
            .put(signUpFailed(mockError))
            .run();
    });

    test('isUserAuthenticated saga should call getSnapShotFromUserAuth if successful', () => {
        const mockUserAuth = { id: 1, name: 'test' };

        return expectSaga(isUserAuthenticated)
            .provide([[call(getCurrentUser), mockUserAuth]])
            .call(getSnapshotFromUserAuth, mockUserAuth)
            .run();
    });

    test('isUserAuthenticated saga should call getCurrentUser and put signInFailed if failed', () => {
        const mockError = new Error('error occured');
        return expectSaga(isUserAuthenticated)
        .provide([[call(getCurrentUser), throwError(mockError)]])
        .put(signInFailed(mockError))
        .run();
    });

    test('signInWithEmail saga should call signInAuthUserWithEmailAndPassword and then getSnapshotFromUserAuth', () => {
        const mockEmail = 'test';
        const mockPassword = 'test2';
        const mockPayload = { email: mockEmail, password: mockPassword };
        const mockUser = { id: 1, name: 'test', email: mockEmail };
        const mockUserCredential = { id: 1, user: mockUser };

        return expectSaga(signInWithEmail, { payload: mockPayload })
            .provide([
                [call(signInAuthUserWithEmailAndPassword, mockEmail, mockPassword), mockUserCredential]
            ])
            .call(getSnapshotFromUserAuth, mockUser)
            .run();
    });

    test('signInWithEmail saga should call signInAuthUserWithEmailAndPassword and signInFailed if failed', () => {
        const mockError = new Error('error occured')        ;
        const mockEmail = 'test';
        const mockPassword = 'test2';
        const mockPayload = { email: mockEmail, password: mockPassword };

        return expectSaga(signInWithEmail, { payload: mockPayload })
            .provide([
                [call(signInAuthUserWithEmailAndPassword, mockEmail, mockPassword), throwError(mockError)]
            ])
            .put(signInFailed(mockError))
            .run();
    });

    test('signInWithGoogle saga should call signInWithGooglePopup and then getSnapShotFromUserAuth', () => {
        const mockUser = { id: 1, name: 'test' };
        const mockGoogleVal = { user: mockUser };
        
        return expectSaga(signInWithGoogle)
            .provide([
                [call(signInWithGooglePopup), mockGoogleVal]
            ])
            .call(getSnapshotFromUserAuth, mockUser)
            .run();
    });

    test('signInWithGoogle saga should call signInWithGooglePopup and signInFailed if failed', () => {
        const mockError = new Error('error occured');

        return expectSaga(signInWithGoogle)
            .provide([
                [call(signInWithGooglePopup), throwError(mockError)]
            ])
            .put(signInFailed(mockError))
            .run();
    });

    test('getSnapshotFromUserAuth saga should call createUserDocumentFromAuth and signInSuccess', () => {
        const mockUserAuth = { id: 1, name: 'test' };
        const mockAdditionalDetails = { displayName: 'test' };
        const mockUserSnapshot = { id: 2, data: () => ({ displayName: 'test' }) };

        return expectSaga(getSnapshotFromUserAuth, mockUserAuth, mockAdditionalDetails)
            .provide([
                [call(createUserDocumentFromAuth, mockUserAuth, mockAdditionalDetails), mockUserSnapshot]
            ])
            .put(signInSuccess({ id: mockUserSnapshot.id, ...mockUserSnapshot.data() }))
            .run();
    });

    test('getSnapShotFromUserAuth saga should put signInFailed if failed', () => {
        const mockError = new Error('error occured');
        const mockUserAuth = { id: 1, name: 'test' };
        const mockAdditionalDetails = { displayName: 'test' };

        return expectSaga(getSnapshotFromUserAuth, mockUserAuth, mockAdditionalDetails)
            .provide([
                [call(createUserDocumentFromAuth, mockUserAuth, mockAdditionalDetails), throwError(mockError)]
            ])
            .put(signInFailed(mockError))
            .run();
    });
})
