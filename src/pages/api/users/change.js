import { firebaseAdmin } from '../../../utlis/firebaseAdmin'


export default async function handler (req, res) {

  const admin = firebaseAdmin

  await admin.auth().generatePasswordResetLink(req.body.email)
  .then(link => {
    res.json(link)
  })
  .catch(err => {
    res.json(err)
  })  
}