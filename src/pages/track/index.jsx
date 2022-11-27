import { Tabs } from '@mantine/core'
import { collection, query, where } from 'firebase/firestore'
import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import DeliveryView from '../../components/DeliveryView'
import { PermissionContext } from '../../layout/Layout'
import { db } from '../../utlis/firebase'

function Track() {

  const [values, loading, error] = useCollectionData(query(collection(db, 'track'), where('isTracking', '==', true)))

  const { service, transac, purchase } = React.useContext(PermissionContext)

  const active = values?.filter(item => {
    return item.isTracking
  })

  const done = values?.filter(item => {
    return item.status !== 'active'
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
          <Tabs.Panel value='Активные' pt={'xl'}>
            <DeliveryView values={active}  />
          </Tabs.Panel>
          <Tabs.Panel value='Доставлено' pt={'xl'}>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  )
}

export default Track