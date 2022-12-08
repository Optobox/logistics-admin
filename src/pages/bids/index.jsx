import { Tabs } from '@mantine/core'
import React from 'react'
import ItemView from '../../components/item/ItemView'

import { DataContext, PermissionContext } from '../../layout/Layout'
import useAuth from '../../hooks/useAuth'

function Bids({}) {

  const { items } = React.useContext(DataContext)

  const { logist, purchase, transac, admin } = React.useContext(PermissionContext)

  const {user} = useAuth()

  const raw = items?.filter((item) => {
    return item.status === 'raw'
  })

  const waiting = items?.filter((item) => {
    return (item.status === 'waiting') && ((item.service_manager?.uid == user?.uid || item.purchase_manager?.uid == user?.uid) || admin)
  })

  const suggested = items?.filter((item) => {
    return (item.status === "suggested") && ((item.service_manager?.uid == user?.uid || item.purchase_manager?.uid == user?.uid) || admin) && (!item.same)
  })

  const same = items?.filter((item) => {
    return (item.status === "suggested") && ((item.service_manager?.uid == user?.uid || item.purchase_manager?.uid == user?.uid) || admin)
  })

  const concated = suggested?.concat(same)

  const rejected = items?.filter((item) => {
    return (item.status === "rejected") && ((item.service_manager?.uid == user?.uid || item.purchase_manager?.uid == user?.uid) || admin)
  })

  const done = items?.filter((item) => {
    return (item.status == 'done') && ((item.service_manager?.uid == user?.uid || item.purchase_manager?.uid == user?.uid) || admin)
  })

  const ended = items?.filter((item) => {
    return (item.status == 'ended') && ((item.service_manager?.uid == user?.uid || item.purchase_manager?.uid == user?.uid) || admin)
  })


  if (purchase || logist || transac) return <></>

  return (
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
  )
}



export default Bids
