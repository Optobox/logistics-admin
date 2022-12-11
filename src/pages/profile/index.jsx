import { Button, TextInput } from '@mantine/core'
import { updateProfile } from 'firebase/auth'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import React from 'react'
import useAuth from '../../hooks/useAuth'
import { PermissionContext } from '../../layout/Layout'
import { db } from '../../utlis/firebase'
import { showNotification } from '@mantine/notifications'

function Profile() {

  const {user, loading} = useAuth()

  const { service, purchase, transac, logist, admin, manager, userData} = React.useContext(PermissionContext)

  console.log(userData);

  const activity = ((new Date().getTime() - new Date(user?.metadata?.creationTime).getTime()) / (1000 * 3600 * 24))

  const [edit, setEdit] = React.useState(true)

  const [profile, setProfile] = React.useState({
    displayName: user?.displayName,
    phoneNumber: userData?.phoneNumber,
  })

  React.useEffect(() => {
    setProfile({
      displayName: user?.displayName,
      phoneNumber: userData?.phoneNumber,
    })
  }, [user, userData])

  const updateUser = async e => {
    await updateProfile(user, {
      displayName: profile.displayName
    })
    .then(async e => {
      if (userData) { 
        await updateDoc(doc(db, 'users', user?.email), {...profile})
      } else {
        await setDoc(doc(db, 'users', user?.email), {
          ...profile,
          email: user?.email,
          uid: user?.uid,
      })
      }
      showNotification({title: 'Менеджер', message: 'Данные успешно сохранены', color: 'green'})
      setEdit(false)
    })
  }

  const handleInput = e => {
    const { name, value } = e.target
    setProfile({...profile, [name]: value})
  }

  if (loading) return <div></div>
  
  if (!user) return <></>

  return (
    <div>
      <Button
        compact
        size='xs'
        variant='subtle'
        onClick={() => setEdit(q => !q)}
      >
        Редактировать
      </Button>
      <div className='max-w-xs mt-6 space-y-5'>
        {edit ? 
          <>
            <div>
              <p className='tracking-tight font-sans font-semibold'>Имя</p>
              <p className='font-medium px-4'>
                {profile.displayName}
              </p>
            </div>
            <div>
              <p className='tracking-tight font-sans font-semibold'>Телефон</p>
              <p className='font-medium px-4'>
                {profile.phoneNumber}
              </p>
            </div>
            <div>
              <p className='tracking-tight font-sans font-semibold'>Почта</p>
              <p className='font-medium px-4'>
                {user?.email}
              </p>
            </div>
            <div>
              <p className='tracking-tight font-sans font-semibold'>Роль</p>
              <p className='font-medium px-4'>
                {service && 'Сервис менеджер'}
                {manager && 'Главный менеджер'}
                {logist && 'Менеджер по логистике'}
                {transac && 'Менеджер по транзакциям'}
                {purchase && 'Менеджер по закупкам'}
                {admin && 'Админ'}
              </p>
            </div>
            <div>
              <p className='tracking-tight font-sans font-semibold'>Активность</p>
              <p className='font-medium px-4'>
                {Math.round(activity)} дней
              </p>
            </div>
          </>
          :
          <>
            <TextInput
              label='Имя'
              name='displayName'
              value={profile.displayName}
              onChange={handleInput}
            />
            <TextInput
              label='Телефон'
              name='phoneNumber'
              value={profile.phoneNumber}
              onChange={handleInput}
            />
          </>
        }
        <p></p>
        <Button
          disabled={edit}
          onClick={updateUser}
        >
          Сохранить
        </Button>
      </div>
    </div>
  )
}

export default Profile