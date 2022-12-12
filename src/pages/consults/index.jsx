import React from 'react'
import { Tabs } from '@mantine/core'
import { ConsultView } from '../../components'
import { DataContext, PermissionContext } from '../../layout/Layout'
import useAuth from '../../hooks/useAuth'

function Consults() {

  const {consults} = React.useContext(DataContext)

  const {user} = useAuth()

  const {admin} = React.useContext(PermissionContext)

  const active = consults?.filter((item) => {
    return item.status == 'raw'
  })

  const rejected = consults?.filter((item) => {
    return item.status === "rejected" && ((item.manager?.uid === user?.uid) || admin)
  })

  const done = consults?.filter((item) => {
    return item.status == 'done' && ((item.manager?.uid === user?.uid) || admin)
  })

  return (
    <div className='w-full pb-24'>
      <div>
        <Tabs
          defaultValue='Активные'
          variant='pills'
          classNames={{
            tabLabel: 'text-base',
          }}
        >
          <Tabs.List>
            <Tabs.Tab value='Активные'>Активные</Tabs.Tab>
            <Tabs.Tab value='Отклоненные'>Отклоненные</Tabs.Tab>
            <Tabs.Tab value='Завершенные'>Завершенные</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='Активные'>
            <ConsultView values={active} />
          </Tabs.Panel>

          <Tabs.Panel value='Отклоненные'>
            <ConsultView values={rejected} />

          </Tabs.Panel>

          <Tabs.Panel value='Завершенные'>
            <ConsultView values={done} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  )
}

export default Consults