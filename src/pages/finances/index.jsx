import React from 'react'
import { Tabs } from '@mantine/core'
import { Notes, Tarif, DeliveryNotes, TransactionNotes, Banking } from '../../components/finances'
import { PermissionContext } from '../../layout/Layout'


function Finances() {

  const {admin} = React.useContext(PermissionContext)

  if (!admin) return <></>

  return (
    <div>
      <Tabs
        defaultValue='Банкинг'
        variant='pills'
        classNames={{
          tabLabel: 'text-base',
        }}
      >
        <Tabs.List>
          <Tabs.Tab value='Банкинг'>Банкинг</Tabs.Tab>
          <Tabs.Tab value='Записи заказов'>Записи заказов</Tabs.Tab>
          <Tabs.Tab value='Записи доставок'>Записи доставок</Tabs.Tab>
          <Tabs.Tab value='Записи транзакций'>Записи транзакций</Tabs.Tab>
          <Tabs.Tab value='Тарифы'>Тарифы</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='Тарифы' pt='md'>
          <Tarif/>
        </Tabs.Panel>
        <Tabs.Panel value='Записи заказов' pt='md'>
          <Notes/>
        </Tabs.Panel>
        <Tabs.Panel value='Записи доставок' pt='md'>
          <DeliveryNotes/>
        </Tabs.Panel>
        <Tabs.Panel value='Записи транзакций' pt='md'>
          <TransactionNotes/>
        </Tabs.Panel>
        <Tabs.Panel value='Банкинг' pt='md'>
          <Banking/>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default Finances