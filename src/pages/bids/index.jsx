import { Menu, Table, Tabs } from '@mantine/core'
import { GetServerSideProps } from 'next'
import React from 'react'
import ItemView from '../../components/item/ItemView'

import { query, collection, DocumentData } from 'firebase/firestore'

import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../../utlis/firebase'
import { PermissionContext } from '../../layout/Layout'

function Bids({}) {

  const [values] = useCollectionData(query(collection(db, 'items')))

  const { logist, purchase, transac, admin } = React.useContext(PermissionContext)

  const [user] = useAuthState(auth)

  const raw = values?.filter((item) => {
    return item.status === 'raw'
  })

  const waiting = values?.filter((item) => {
    return (item.status === 'waiting') && ((item.service_manager?.uid == user?.uid) || admin)
  })

  const suggested = values?.filter((item) => {
    return (item.status === "suggested") && 
    // ((item.service_manager?.uid == user?.uid) || admin) && 
    (!item.same)
  })

  const same = values?.filter((item) => {
    return (item.status === "suggested" && item.same) && admin
  })

  const concated = suggested?.concat(same)

  const rejected = values?.filter((item) => {
    return (item.status === "rejected") && ((item.service_manager?.uid == user?.uid) || admin)
  })

  const done = values?.filter((item) => {
    return (item.status == 'done') && ((item.service_manager?.uid == user?.uid) || admin)
  })

  const ended = values?.filter((item) => {
    return (item.status == 'ended') && ((item.service_manager?.uid == user?.uid) || admin)
  })

  if (purchase || logist || transac) return <></>

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
            <Tabs.Tab value='Ожидающие'>Ожидающие</Tabs.Tab>
            <Tabs.Tab value='Предложенные'>Предложенные</Tabs.Tab>
            <Tabs.Tab value='Заключено'>Заключено</Tabs.Tab>
            <Tabs.Tab value='Завершено'>Завершено</Tabs.Tab>
            <Tabs.Tab value='Отклоненные'>Отклоненнo</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='Активные' pt='md'>
            <ItemView values={raw} />
          </Tabs.Panel>
          <Tabs.Panel value='Ожидающие' pt='md'>
            <ItemView values={waiting} />
          </Tabs.Panel>
          <Tabs.Panel value='Отклоненные' pt='md'>
            <ItemView values={rejected} />
          </Tabs.Panel>
          <Tabs.Panel value='Предложенные' pt='md'>
            <ItemView values={admin ? concated : suggested} />
          </Tabs.Panel>
          <Tabs.Panel value='Заключено' pt='md'>
            <ItemView values={done} />
          </Tabs.Panel>
          <Tabs.Panel value='Завершено' pt='md'>
            <ItemView values={ended} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  )
}



export default Bids
