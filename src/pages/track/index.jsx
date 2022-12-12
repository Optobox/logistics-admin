import { Tabs } from '@mantine/core'
import React from 'react'
import DeliveryView from '../../components/delivery/DeliveryView'
import useAuth from '../../hooks/useAuth'
import { DataContext, PermissionContext } from '../../layout/Layout'

function Track() {

  const {tracks} = React.useContext(DataContext)

  const { service, transac, purchase, admin } = React.useContext(PermissionContext)

  const {user} = useAuth()

  const active = tracks?.filter(item => {
    return (item.isTracking && !item.ended) && ((item.manager?.uid === user?.uid || admin))
  })

  const ended = tracks?.filter(item => {
    return item.ended && ((item.manager?.uid === user?.uid) || admin)
  })

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
            <Tabs.Tab value='Доставлено'>Доставлено</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='Активные'>
            <DeliveryView values={active}  />
          </Tabs.Panel>
          <Tabs.Panel value='Доставлено'>
            <DeliveryView values={ended}  />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  )
}

export default Track