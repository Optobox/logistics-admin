import React from 'react'
import { firebaseAdmin } from '../../utlis/firebaseAdmin'
import { Table } from '@mantine/core';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

function USers({users = []}) {

  return (
    <div className='w-full'>
      <div className='text-center text-2xl mb-4'>
        Пользователи
      </div>
      <div>
        <Table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Почта</th>
              <th>UID</th>
              <th>Зарегитрировался</th>
              <th>Последний заход</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((item) => {

              const createdAt = item?.metadata?.creationTime ? format(new Date(item?.metadata?.creationTime), 'dd/MM/yyyy, H:mm', {locale: ru}) : ''
              const signinAt = item?.metadata?.creationTime ? format(new Date(item?.metadata?.lastSignInTime), 'dd/MM/yyyy, H:mm', {locale: ru}) : ''

              return (
                <tr key={item?.email}>
                  <td>{item?.displayName}</td>
                  <td>{item?.email}</td>
                  <td>{item?.uid}</td>
                  <td>{createdAt}</td>
                  <td>{signinAt}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export async function getServerSideProps () {

  const admin = firebaseAdmin
 
  const users = (await admin.auth().listUsers(300)).users

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)) 
    }
  }
}

export default USers