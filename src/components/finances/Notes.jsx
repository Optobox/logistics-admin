import { Table } from '@mantine/core'
import dayjs from 'dayjs'
import React from 'react'
import cn from 'classnames'

import {styles} from '../item/ItemView'
import quoteSeperateNumber from '../../utlis/quoteSeperator'
import { DataContext } from '../../layout/Layout'

function Notes({lastElements, className, disabled}) {

  const items = []

  const {records} = React.useContext(DataContext)

  console.log(records);
  

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
    <div className={cn('grid grid-cols-1 2xl:grid-cols-[65%_35%] w-full dark:bg-slate-800', className)}>
      <Table className='h-min'>
        <thead>
          <tr>
            <th>ID заказа</th>
            <th>Доход</th>
            <th>Стоимость</th>
            <th>Вал прибыль </th>
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

            const prib = item?.received_sum - cost
            const servicePrib = (prib * item?.service_tarif) / 100 
            const purchasePrib = (prib * item?.purchase_tarif) / 100
            const ourPrib = prib - (servicePrib + purchasePrib)
            const endedAt = dayjs(item?.endedAt?.seconds * 1000).format('DD-MM-YYYY, HH:mm')

            return (
              <tr 
                key={i}
                onClick={() => handleSelected(item?.id, item)}
                className={cn('transition-all duration-200', {
                  'dark:bg-gray-500': selected == item?.id,
                })}
              >
                <td>{item?.id}</td>
                <td>{quoteSeperateNumber(Number(item?.received_sum))}</td>
                <td>{quoteSeperateNumber(Number(cost))}</td>
                <td>{quoteSeperateNumber(Number(prib))}</td>
                <td>{quoteSeperateNumber(Number(servicePrib))}</td>
                <td>{quoteSeperateNumber(Number(purchasePrib))}</td>
                <td>{quoteSeperateNumber(Number(ourPrib))}</td>
                {/* <td>{endedAt}</td> */}
              </tr>
            )
          })?.slice(lastElements ? lastElements : 0)}
        </tbody>
      </Table>
      {(selected && !disabled) && (
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
            <p className={styles.value}>{quoteSeperateNumber(Number(item?.cost))} тг</p>
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