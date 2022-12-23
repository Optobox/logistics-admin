import { Button, FileButton, FileInput, TextInput } from '@mantine/core'
import { updateProfile } from 'firebase/auth'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import React from 'react'
import useAuth from '../../hooks/useAuth'
import { PermissionContext } from '../../layout/Layout'
import { db } from '../../utlis/firebase'
import { showNotification } from '@mantine/notifications'
import { uploadAndGetImage } from '../../utlis/upload'

function Profile() {

  const {user, loading} = useAuth()

  const { service, purchase, transac, logist, admin, manager, userData} = React.useContext(PermissionContext)

  const activity = ((new Date().getTime() - new Date(user?.metadata?.creationTime).getTime()) / (1000 * 3600 * 24))

  const [edit, setEdit] = React.useState(true)

  const [image, setImage] = React.useState(null)

  const handleImage = e => {
    if (!e) return
    setImage(e)
  }

  const [profile, setProfile] = React.useState({
    displayName: '',
    phoneNumber: '',
    photoURL: null
  })

  React.useEffect(() => {
    setProfile({
      displayName: user?.displayName ?? null,
      phoneNumber: userData?.phoneNumber ?? null,
      photoURL: user?.photoURL ?? null
    })
  }, [user, userData])

  const updateUser = async () => {
    if (image) {
      await uploadAndGetImage(`/users/${user?.email}`, image)
      .then(async e => {
        await updateProfile(user, {
          displayName: profile.displayName,
          photoURL: e
        })
        .then(async () => {
          if (userData) { 
            console.log('update with image');
            await updateDoc(doc(db, 'users', user?.email), {...profile})
          } else {
            console.log('set with image');
            await setDoc(doc(db, 'users', user?.email), {
              ...profile,
              email: user?.email,
              uid: user?.uid,
              photoURL: e
          })
          }
          showNotification({title: 'Менеджер', message: 'Данные успешно сохранены', color: 'green'})
          setEdit(true)
          setImage(null)
        })
      })
      return
    }

    await updateProfile(user, {
      displayName: profile.displayName,
    })
    .then(async e => {
      if (userData) { 
        await updateDoc(doc(db, 'users', user?.email), {...profile})
        console.log('update without image');
      } else {
        console.log('set without image');
        await setDoc(doc(db, 'users', user?.email), {
          ...profile,
          email: user?.email,
          uid: user?.uid,
      })
      }
      showNotification({title: 'Менеджер', message: 'Данные успешно сохранены', color: 'green'})
      setEdit(true)
      setImage(null)
    })
  }

  const handleInput = e => {
    const { name, value } = e.target
    setProfile({...profile, [name]: value})
  }

  if (loading) return <div></div>
  
  if (!user) return <></>

  return (
    <div className='space-y-4 ml-5'>
      <div className='flex gap-5 mt-6'>
        {edit ? 
          <div className='flex'>
            {user?.photoURL && (
              <div className='mr-5'>
                <img src={user?.photoURL} alt="" className='rounded-full w-16'/>
              </div>
            )}
            <div>
              <div className='flex gap-5 '>
                <div>
                  <p className='tracking-tight text-xs text-gray-300'>Имя</p>
                  <p className='font-medium text-sm'>
                    {profile.displayName}
                  </p>
                </div>
              <div>
                <p className='tracking-tight text-xs text-gray-300'>Роль</p>
                <p className='font-medium text-sm'>
                  {service && 'Сервис менеджер'}
                  {manager && 'Главный менеджер'}
                  {logist && 'Менеджер по логистике'}
                  {transac && 'Менеджер по транзакциям'}
                  {purchase && 'Менеджер по закупкам'}
                  {admin && 'Админ'}
                </p>
              </div>
              <div>
                <p className='tracking-tight text-xs text-gray-300'>Телефон</p>
                <p className='font-medium text-sm'>
                  {profile.phoneNumber}
                </p>
              </div>
              <div>
                <p className='tracking-tight text-xs text-gray-300'>Почта</p>
                <p className='font-medium text-sm'>
                  {user?.email}
                </p>
              </div>
              <div>
                <p className='tracking-tight text-xs text-gray-300'>Активность</p>
                <p className='font-medium text-sm'>
                  {Math.round(activity)} дней
                </p>
              </div>
              </div>
              <Button
                compact
                size='xs'
                variant='subtle'
                onClick={() => setEdit(q => !q)}
              >
                Редактировать
              </Button>
            </div>
          </div>
          :
          <>
            <TextInput
              label='Имя'
              name='displayName'
              value={profile.displayName ?? ''}
              onChange={handleInput}
            />
            <TextInput
              label='Телефон'
              name='phoneNumber'
              value={profile.phoneNumber ?? ''}
              onChange={handleInput}
            />
            <div>
              <FileButton  
                onChange={handleImage}
              >
                {(props) => <Button compact variant='subtle' {...props}>Выбрать изображение</Button>}
              </FileButton>
              {image && (
                <img src={URL.createObjectURL(image) } alt="" className='w-16 rounded-full' />
              )}
            </div>
          </>
        }
      </div>
      {!edit && (
        <Button
          disabled={edit}
          onClick={updateUser}
        >
          Сохранить
        </Button>
      )}
    </div>
  )
}

export default Profile