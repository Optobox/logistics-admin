import { Table } from '@mantine/core'
import dayjs from 'dayjs'
import { collection, query } from 'firebase/firestore'
import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { db } from '../../utlis/firebase'

function ManagersTable({managers}) {


  const checkRole = (role) => {
    if (role.includes('service')) return 'Сервис менеджер'
    if (role.includes('purchase')) return 'Закуп менеджер'
    if (role.includes('logist')) return 'Логист менеджер'
    if (role.includes('transac')) return 'Транзакции менеджер'
    if (role.includes('manager')) return 'Главный менеджер'
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Роль</th>
          <th>Имя</th>
          <th>Почта</th>
          <th>Телефон</th>
          <th>Дата регистрации</th>
        </tr>
      </thead>
      <tbody>
        {managers?.map((e, i) => {

          const createdAt = dayjs(e.metadata?.creationTime).format('DD.MM.YY, HH:mm')

          return (
            <tr key={i}>
              <td>
                {checkRole(e.email)}
              </td>
              <td>{e.displayName}</td>
              <td>{e.email}</td>
              <td>{}</td>
              <td>{createdAt}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default ManagersTable