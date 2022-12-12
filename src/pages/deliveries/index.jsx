import React from 'react'

import DeliveryView from '../../components/delivery/DeliveryView'
import { DataContext, PermissionContext } from '../../layout/Layout'
import { Tabs } from '@mantine/core'
import useAuth from '../../hooks/useAuth'

function Deliveries() {


  const {tracks} = React.useContext(DataContext)

  const {service, purchase, transac, admin} = React.useContext(PermissionContext)

  const {user} = useAuth()

  const myDeliveries = tracks?.filter((e => {
    return !e.isTrackikng && ((e.manager?.uid == user?.uid || (admin && !e.isTracking)))  
  }))
  
  const deliveries = tracks?.filter((e => { 
    return !e.isTracking && !e.manager
  }))

  console.log(deliveries);
  // const sortedBySMallest = deliveries?.sort((a, b) => {
  //   return b.createdAt?.seconds - a.createdAt?.seconds
  // })

  if (service || purchase || transac) return <></>

  return (
    <>
      <div className='w-full pb-24'>
      <Tabs
          defaultValue='Активные'
          variant='pills'
          classNames={{
            tabLabel: 'text-base',
          }}
        >
          <Tabs.List>
            <Tabs.Tab value='Активные'>Активные</Tabs.Tab>
            <Tabs.Tab value='В работе'>В работе</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='Активные'>
            <DeliveryView values={deliveries} />    
          </Tabs.Panel>

          <Tabs.Panel value='В работе'>
            <DeliveryView values={myDeliveries} />    
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  )
}

export default Deliveries