import { NONAME } from 'dns';
import {
  initializeApp,
  getApps,
  FirebaseApp,
  FirebaseOptions,
} from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  initializeFirestore,
  setDoc,
  doc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBs53kQJAQMjOhndu_tKDHC8-cgrIZxBjk',
  authDomain: 'bombattackermulti.firebaseapp.com',
  projectId: 'bombattackermulti',
  storageBucket: 'bombattackermulti.appspot.com',
  messagingSenderId: '486948311827',
  appId: '1:486948311827:web:8ce6831d2cd03c16b340e6',
};
const app = initializeApp(firebaseConfig);
initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const signIn = async () => {
  await signInWithPopup(auth, provider).then((res) => {
    setDoc(doc(db, 'users', res.user.uid), {
      name: 'NoName',
      uid: res.user.uid,
      BestScore: 0,
      Scores: [],
    }).catch((error) => {
      console.log(error.message);
    });

    console.log(res.user.displayName);
    console.log(res.user.uid);

    localStorage.setItem('userId', res.user.uid);
    localStorage.setItem('isAuth', 'true');
  });
};

export { auth, provider, db, signIn };
