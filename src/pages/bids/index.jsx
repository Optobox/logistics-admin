import { Tabs } from '@mantine/core'
import React from 'react'
import ItemView from '../../components/item/ItemView'

import { BidsContext, DataContext, PermissionContext } from '../../layout/Layout'

function Bids({}) {

  const { rawBids, suggestedBids, rejectedBids, waitingBids, doneBids, endedBids } = React.useContext(BidsContext)
  const { raws, suggesteds, rejecteds, waitings, dones, records } = React.useContext(DataContext)
  const { logist, purchase, transac, admin } = React.useContext(PermissionContext)

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
        <Tabs.Panel value='Активные' >
          <ItemView values={admin ? raws : rawBids} status='raw' />
        </Tabs.Panel>
        <Tabs.Panel value='Ожидающие' >
          <ItemView values={admin ? waitings : waitingBids} status='waiting' />
        </Tabs.Panel>
        <Tabs.Panel value='Отклоненные' >
          <ItemView values={admin ? rejecteds : rejectedBids} status='rejected' />
        </Tabs.Panel>
        <Tabs.Panel value='Предложенные' >
          <ItemView values={admin ? suggesteds : suggestedBids} status='suggested' />
        </Tabs.Panel>
        <Tabs.Panel value='Заключено' >
          <ItemView values={admin ? dones : doneBids} status='done' />
        </Tabs.Panel>
        <Tabs.Panel value='Завершено' >
          <ItemView values={admin ? [] : endedBids} status='ended' />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}



export default Bids
