import React from 'react'
import { Tabs } from '@mantine/core'
import ConsultView from '../../components/ConsultView'
import { ConsultContext, DataContext, PermissionContext } from '../../layout/Layout'

function Consults() {

  const {consults} = React.useContext(ConsultContext)

  const {allConsults, stats} = React.useContext(DataContext)

  const {admin} = React.useContext(PermissionContext)

  const active = allConsults?.filter((item) => {
    return item.status == 'raw'
  })

  const rejected = allConsults?.filter((item) => {
    return item.status === "rejected"
  })

  const done = allConsults?.filter((item) => {
    return item.status === 'done'
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
            <ConsultView values={admin ? active : consults} status='raw' />
          </Tabs.Panel>

          <Tabs.Panel value='Отклоненные'>
            <ConsultView values={admin ? rejected : []} />

          </Tabs.Panel>

          <Tabs.Panel value='Завершенные'>
            <ConsultView values={admin ? done : []} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  )
}

export default Consults