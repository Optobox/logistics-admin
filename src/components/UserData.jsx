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

  const {service, manager, logist, transac, purchase, admin, userData} = React.useContext(PermissionContext)

  const activity = ((new Date().getTime() - new Date(user?.metadata?.creationTime).getTime()) / (1000 * 3600 * 24))

  const [value] = useDocumentData(doc(db, 'users', String(user?.email)))

  if (loading) return <div></div>
  
  if (!user) return <></>

  return (
    <div className='font-manrope flex flex-col max-w-md'>
      <Avatar src={user.photoURL} />
      <ul className='space-y-4 grid grid-cols-3'>
        <li className='flex flex-col'>
          <span>Имя: </span>
          <span>{user?.displayName}</span>
        </li>
        <li className='flex flex-col'>
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
        <li className='flex flex-col'>
          <span>Тел: </span>
          <span>{userData?.phoneNumber}</span>
        </li>
        <li className='flex flex-col'>
          <span>Почта: </span>
          <span>{user?.email}</span>
        </li>
        <li className='flex flex-col'>
          <span>Активность: </span>
          <span>{Math.round(activity)} дней</span>
        </li>
      </ul>
    </div>
  )
}

export default UserData