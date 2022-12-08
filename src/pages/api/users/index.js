import {firebaseAdmin} from '../../../utlis/firebasdAdmin'

export default async function handler (req, res) {

  const admin = firebaseAdmin

  const user = await admin.auth().createUser({
    email: req.body.email,
    emailVerified: true, 
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    displayName: req.body.displayName,
  })

  console.log(user);

  res.json({
    ...user
  })
}