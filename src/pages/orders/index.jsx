import { Tabs } from '@mantine/core'
import React from 'react'
import ItemView from '../../components/item/ItemView'
import { BidsContext, PermissionContext } from '../../layout/Layout'

function Orders() {

  const { adoptedBids, doneBids, suggestedBids, endedBids, waitingBids } = React.useContext(BidsContext)

  const {manager, service, logist, transac } = React.useContext(PermissionContext)

  if (transac || logist) return <></>

  return (
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
        <Tabs.Panel value='Принятые'>
          <ItemView values={adoptedBids ?? []} status='adopted' />
        </Tabs.Panel>
        <Tabs.Panel value='Предложенные'>
          <ItemView values={suggestedBids} status='suggested' />
        </Tabs.Panel>
        <Tabs.Panel value='Ожидающие'>
          <ItemView values={waitingBids} status='waiting' />
        </Tabs.Panel>
        <Tabs.Panel value='Заключено'>
          <ItemView values={doneBids} status='done' />
        </Tabs.Panel>
        <Tabs.Panel value='Завершено'>
          <ItemView values={endedBids} status='ended' />
        </Tabs.Panel>
      </Tabs>
  )
}

export default Orders