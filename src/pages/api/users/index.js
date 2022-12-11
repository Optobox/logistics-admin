import { serverTimestamp } from 'firebase/firestore';
import {firebaseAdmin} from '../../../utlis/firebasdAdmin'

export default async function handler (req, res) {

  const admin = firebaseAdmin

  await admin.auth().createUser({
    email: req.body.email,
    emailVerified: true, 
    password: req.body.password,
    displayName: req.body.displayName,
    uid: req.body.email
  })
  .then(async e => {
    await admin.firestore().collection('users').doc(req.body.email).create({
      email: req.body.email,
      displayName: req.body.displayName,
      uid: req.body.email,
      phoneNumber: req.body.phoneNumber ?? null
    })
    .then(e => {
      res.json({
       message: 'Пользователь создан'
      })
    })
  })
  .catch(e => {
    console.log(e, 'err');
    if (e.code === 'auth/uid-already-exists') {
      res.status(400).json({
        message: 'Почта уже используется'
      })
      return 
    }
  })
}