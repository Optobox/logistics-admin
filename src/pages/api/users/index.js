import {firebaseAdmin} from '../../../utlis/firebaseAdmin'

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
    await admin.firestore().collection('records').doc(req.body.email).create({
      email: req.body.email,
      displayName: req.body.displayName,
      phoneNumber: req.body.phoneNumber ?? null
    })
    .then(async e => {
      await admin.firestore().collection('users').doc(req.body.email).create({
        email: req.body.email,
        displayName: req.body.displayName,
        uid: req.body.email,
        phoneNumber: req.body.phoneNumber ?? null
      })
      .then(async e => {
        res.json({
          message: 'Пользователь создан'
         })
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