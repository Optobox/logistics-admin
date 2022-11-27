import { Tabs } from '@mantine/core'
import { collection, query } from 'firebase/firestore'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import ItemView from '../../components/item/ItemView'
import { PermissionContext } from '../../layout/Layout'
import { auth, db } from '../../utlis/firebase'

function Orders() {

  const [values] = useCollectionData(query(collection(db, 'items')))

  const {manager, service, logist, transac, admin} = React.useContext(PermissionContext)

  const [user] = useAuthState(auth)

  const adopted = values?.filter((item => {
    return (item?.status === 'adopted')
  }))

  const suggested = values?.filter((item => {
    return (item?.status === 'suggested') && ((item?.purchase_manager?.uid == user?.uid) || admin)
  }))
  
  const waiting = values?.filter((item => {
    return (item?.status === 'waiting') && ((item?.purchase_manager?.uid == user?.uid) || admin)
  }))

  const done = values?.filter((item => {
    return (item?.status === 'done') && ((item?.purchase_manager?.uid == user?.uid) || admin)
  }))

  if (transac || logist) return <></>

  return (
    <div className='w-full pb-24'>
      <Tabs
        defaultValue='Принятые'
        variant='pills'
        classNames={{
          tabLabel: 'text-base',
        }}
      >
        <Tabs.List>
          <Tabs.Tab value='Принятые'>Принятые</Tabs.Tab>
          <Tabs.Tab value='Предложенные' disabled={service || manager}>Предложенные</Tabs.Tab>
          <Tabs.Tab value='Ожидающие' disabled={service || manager}>Ожидающие</Tabs.Tab>
          <Tabs.Tab value='Заключено' disabled={service || manager}>Заключено</Tabs.Tab>
          <Tabs.Tab value='Завершено' disabled={service || manager}>Завершено</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='Принятые' pt='md'>
          <ItemView values={adopted} />
        </Tabs.Panel>
        <Tabs.Panel value='Предложенные' pt='md'>
          <ItemView values={suggested} />
        </Tabs.Panel>
        <Tabs.Panel value='Ожидающие' pt='md'>
          <ItemView values={waiting} />
        </Tabs.Panel>
        <Tabs.Panel value='Заключено' pt='md'>
          <ItemView values={done} />
        </Tabs.Panel>
        <Tabs.Panel value='Завершено' pt='md'>
          <ItemView values={done} />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default Orders