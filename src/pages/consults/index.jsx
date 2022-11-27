import React from 'react'
import { Tabs } from '@mantine/core'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { collection, query } from 'firebase/firestore'
import { db } from '../../utlis/firebase'

import { ConsultView } from '../../components'

function Consults() {

  const [values] = useCollectionData(query(collection(db, 'consults')))

  const active = values?.filter((item) => {
    return item.status == 'raw'
  })


  const rejected = values?.filter((item) => {
    return item.status === "rejected"
  })

  const done = values?.filter((item) => {
    return item.status == 'done'
  })

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
            <Tabs.Tab value='Отклоненные'>Отклоненные</Tabs.Tab>
            <Tabs.Tab value='Завершенные'>Завершенные</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='Активные' pt='md'>
            <ConsultView values={active} />
          </Tabs.Panel>

          <Tabs.Panel value='Отклоненные' pt='md'>
            <ConsultView values={rejected} />

          </Tabs.Panel>

          <Tabs.Panel value='Завершенные' pt='md'>
            <ConsultView values={done} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  )
}

export default Consults