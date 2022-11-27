import React from 'react'

import { collection,  query } from 'firebase/firestore'
import { db } from '../../utlis/firebase'
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'
import DeliveryView from '../../components/DeliveryView'
import { PermissionContext } from '../../layout/Layout'
import { Tabs } from '@mantine/core'

function Deliveries() {

  const [tracks, loading, error] = useCollectionData(query(collection(db, 'track')))

  const {service, purchase, transac} = React.useContext(PermissionContext)

  const deliveries = tracks?.filter((e => {
    return !e.isTracking
  }))

  const sortedBySMallest = deliveries?.sort((a, b) => {
    return b.createdAt?.seconds - a.createdAt?.seconds
  })

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
          <Tabs.Panel value='Активные' pt='md'>
            <DeliveryView values={tracks} />    
          </Tabs.Panel>

          <Tabs.Panel value='В работе' pt='md'>
            <DeliveryView values={tracks} />    
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  )
}

export default Deliveries