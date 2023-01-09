import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBs53kQJAQMjOhndu_tKDHC8-cgrIZxBjk',
  authDomain: 'bombattackermulti.firebaseapp.com',
  projectId: 'bombattackermulti',
  storageBucket: 'bombattackermulti.appspot.com',
  messagingSenderId: '486948311827',
  appId: '1:486948311827:web:8ce6831d2cd03c16b340e6',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
