import { Tabs } from '@mantine/core'
import React from 'react'
import ItemView from '../../components/item/ItemView'
import useAuth from '../../hooks/useAuth'
import { DataContext, PermissionContext } from '../../layout/Layout'

function Orders() {

  const {items} = React.useContext(DataContext)

  const {manager, service, logist, transac, admin} = React.useContext(PermissionContext)

  const {user} = useAuth()

  const adopted = items?.filter((item => {
    return (item?.status === 'adopted')
  }))

  const suggested = items?.filter((item => {
    return (item?.status === 'suggested') && ((item?.purchase_manager?.uid == user?.uid) || admin)
  }))
  
  const waiting = items?.filter((item => { 
    return (item?.status === 'waiting') && ((item?.purchase_manager?.uid == user?.uid) || admin)
  }))

  const done = items?.filter((item => {
    return (item?.status === 'done') && ((item?.purchase_manager?.uid == user?.uid) || admin)
  }))

  const ended = items?.filter((item => {
    return (item?.status === 'ended') && ((item?.purchase_manager?.uid == user?.uid) || admin)
  }))

  if (transac || logist) return <></>

  return (
    <div className='w-full pb-24 dark:bg-slate-800 p-4'>
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
          <ItemView values={ended} />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default Orders