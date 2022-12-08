import { Avatar } from '@mantine/core'
import dayjs from 'dayjs'
import { doc,} from 'firebase/firestore'
import React from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import useAuth from '../hooks/useAuth'
import { PermissionContext } from '../layout/Layout'
import { db } from '../utlis/firebase'

function UserData() {

  const {user, loading} = useAuth()

  const {service, manager, logist, transac, purchase, admin} = React.useContext(PermissionContext)

  const activity = new Date((new Date().getTime() - new Date(user?.metadata?.creationTime)) * 1000)  

  const [value] = useDocumentData(doc(db, 'users', String(user?.email)))

  if (loading) return <div></div>
  
  if (!user) return <></>

  return (
    <div className='flex items-center gap-x-20'>
      <Avatar src={user.photoURL} />
      <ul>
        <li>
          <span>Имя: </span>
          <span>{user?.displayName}</span>
        </li>
        <li>
          <span>Роль: </span>
          <span>
            {service && 'Сервис менеджер'}
            {manager && 'Главный менеджер'}
            {logist && 'Менеджер по логистике'}
            {transac && 'Менеджер по транзакциям'}
            {purchase && 'Менеджер по закупкам'}
            {admin && 'Админ'}
          </span>
        </li>
        <li>
          <span>Тел: </span>
          <span>{value?.phoneNumber}</span>
        </li>
      </ul>
      <ul>
        <li>
          <span>Почта: </span>
          <span>{user?.email}</span>
        </li>
        <li>
          <span>UID: </span>
          <span>{user?.uid}</span>
        </li>
        <li>
          <span>Активность: </span>
          <span>{dayjs(activity).format('DD')} дней</span>
        </li>
      </ul>
    </div>
  )
}

export default UserData