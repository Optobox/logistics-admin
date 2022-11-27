import React from 'react'
import { Tabs, TextInput, Select, PasswordInput, Button, Table } from '@mantine/core'
import { firebaseAdmin } from '../../utlis/firebasdAdmin'
import { ChangeManagerPassword, CreateManager, ManagersTable } from '../../components/managers'
import dayjs from 'dayjs'

function Managers({users}) {

  const managers = users?.filter(e => {
    return e.email?.includes('optobox')
  })

  const checkRole = (role) => {
    if (role.includes('service')) return 'Сервис менеджер'
    if (role.includes('purchase')) return 'Закуп менеджер'
    if (role.includes('logist')) return 'Логист менеджер'
    if (role.includes('transac')) return 'Транзакции менеджер'
    if (role.includes('manager')) return 'Главный менеджер'
  }

  return (
    <div className='w-full pb-24'>
      <Tabs
          defaultValue='Управление'
          variant='pills'
          classNames={{
            tabLabel: 'text-base',
          }}
        >
        <Tabs.List>
          <Tabs.Tab value='Управление'>Управление</Tabs.Tab>
          <Tabs.Tab value='Статистика'>Статистика</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='Управление' pt='md'>
          <div className='space-y-4'>
            <div className='flex gap-16'>
              <CreateManager/>
              <ChangeManagerPassword/>
            </div>
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
          </div>
        </Tabs.Panel>
        <Tabs.Panel value='Статистика' pt='md'>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export async function getServerSideProps() {

  const admin = firebaseAdmin

  const users = (await admin.auth().listUsers(1000)).users

  return {
    props: {
      users: JSON.parse(JSON.stringify(users))
    }
  }
}

export default Managers