import { Tabs } from '@mantine/core'
import React from 'react'
import DeliveryView from '../../components/delivery/DeliveryView'
import { DataContext, PermissionContext, TrackContext } from '../../layout/Layout'

function Tracks() {

  const {active, working, tracking, delivered} = React.useContext(TrackContext)

  const {actives, workings, trackings, delivereds} = React.useContext(DataContext)

  const {service, purchase, transac, admin} = React.useContext(PermissionContext)

  if (service || purchase || transac) return <></>

  return (
    <div className='w-full pb-24'>
      <div>
        <Tabs
          variant='pills'
          defaultValue='Активные'
          classNames={{
            tabLabel: 'text-base',
          }}
        >
          <Tabs.List>
            <Tabs.Tab value='Активные'>Активные</Tabs.Tab>
            <Tabs.Tab value='В работе'>В работе</Tabs.Tab>
            <Tabs.Tab value='Отслеживается'>Отслеживается</Tabs.Tab>
            <Tabs.Tab value='Доставлено'>Доставлено</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='Активные'>
            <DeliveryView values={admin ? actives : active} status='active' />
          </Tabs.Panel>
          <Tabs.Panel value='В работе'>
            <DeliveryView values={admin ? workings : working} status='working' />
          </Tabs.Panel>
          <Tabs.Panel value='Отслеживается'>
            <DeliveryView values={admin ? trackings : tracking} status='tracking' />
          </Tabs.Panel>
          <Tabs.Panel value='Доставлено'>
            <DeliveryView values={admin ? delivereds : delivered} status='delivered' />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  )
}

export default Tracks