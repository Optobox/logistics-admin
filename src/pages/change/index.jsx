import React from 'react'
import { Tabs } from '@mantine/core'
import { PermissionContext } from '../../layout/Layout'

function Change() {

  const {logist, purchase, service} = React.useContext(PermissionContext)

  if (logist || purchase || service) return <></>

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
          <Tabs.Tab value='Отклоненные'>Отклоненные</Tabs.Tab>
          <Tabs.Tab value='Завершенные'>Завершенные</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='Активные'>
          {/* <Tablet array={active} /> */}
        </Tabs.Panel>

        <Tabs.Panel value='Отклоненные'>
          {/* <Tablet array={rejected} /> */}
        </Tabs.Panel>

        <Tabs.Panel value='Завершенные'>
          {/* <Tablet array={archived} /> */}
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default Change