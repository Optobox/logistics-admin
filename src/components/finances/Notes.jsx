import { Table } from '@mantine/core'
import dayjs from 'dayjs'
import React from 'react'
import { DataContext } from '../../layout/Layout'
import cn from 'classnames'

import {styles} from '../item/ItemView'

function Notes() {

  const {items, tracks} = React.useContext(DataContext)

  const endedItems = items?.filter(e => {
    return e?.status === 'ended'
  })

  const [item, setItem] = React.useState({})
  const [selected, setSelected] = React.useState(null)

  const handleSelected = (id, item) => {
    setSelected(id)
    setItem(item)
  }

  const url = item?.urls?.filter(e => {
    return e?.selected
  })?.[0]?.link

  return (
    <div className='grid grid-cols-1 2xl:grid-cols-[65%_35%] w-full'>
      <Table className='h-min'>
        <thead>
          <tr>
            <th>ID заказа</th>
            <th>Доход</th>
            <th>Стоимость</th>
            <th>Вас прибыль </th>
            <th>Сервис.</th>
            <th>Закупщик.</th>
            <th>Прибыль.</th>
            <th>Дата завершения</th>
          </tr>
        </thead>
        <tbody>
          {endedItems?.map((item, i) => {

            const cost = item?.urls?.filter(e => {
              return e?.selected
            })?.[0]?.cost

            const prib = item?.our_cost - cost
            const servicePrib = (prib * item?.service_tarif) / 100 
            const purchasePrib = (prib * item?.purchase_tarif) / 100
            const ourPrib = prib - (servicePrib + purchasePrib)
            const endedAt = dayjs(item?.endedAt?.seconds * 1000).format('DD-MM-YYYY, HH:mm')

            return (
              <tr 
                key={i}
                onClick={() => handleSelected(item?.id, item)}
                className={cn('transition-all duration-200', {
                  'bg-slate-100': selected == item?.id,
                })}
              >
                <td>{item?.id}</td>
                <td>{item?.our_cost}</td>
                <td>{cost}</td>
                <td>{prib}</td>
                <td>{servicePrib}</td>
                <td>{purchasePrib}</td>
                <td>{ourPrib}</td>
                <td>{endedAt}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      {selected && (
        <div className='p-4 border space-y-4'>
          <div className={styles.block}>
            <p className={styles.label}>Дата создания:</p>
            <p className={styles.value}>{dayjs(item?.createdAt?.seconds * 1000).format('DD-MM-YYYY, HH:mm')}</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Имя:</p>
            <p className={styles.value}>{item?.name}</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Город</p>
            <p className={styles.value}>{item?.city}</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Номер телефона</p>
            <p className={styles.value}>{item?.tel}</p>
          </div>
          {item?.wh && (
            <div className={styles.block}>
              <p className={styles.label}>Whatsapp</p>
              <p className={styles.value}>{item?.wh}</p>
            </div>
          )}
          {item?.tg && (
            <div className={styles.block}>
              <p className={styles.label}>Telegram</p>
              <p className={styles.value}>{item?.tg}</p>
            </div>
          )}
          {item?.instagram && (
            <div className={styles.block}>
              <p className={styles.label}>Instagram</p>
              <p className={styles.value}>{item?.instagram}</p>
            </div>
          )}
          <div className={styles.block}>
            <p className={styles.label}>Название</p>
            <p className={styles.value}>{item?.title}</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Количество</p>
            <p className={styles.value}>{item?.count}</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Бюджет</p>
            <p className={styles.value}>{item?.cost} тг</p>
          </div>

          <div className={styles.block}>
            <p className={styles.label}>Описание</p>
            <p className={styles.value}>{item?.description}</p>
          </div>

          <div className={styles.block}>
            <p className={styles.label}>Ссылка</p>
            <p className={styles.value}>
              <a href={url} target={'_blank'} className='text-blue-500'>
                {url}
              </a>
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Сервис id</p>
            <p className={styles.value}>{item?.service_manager?.email}</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Закупшик id</p>
            <p className={styles.value}>{item?.purchase_manager?.email}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notes