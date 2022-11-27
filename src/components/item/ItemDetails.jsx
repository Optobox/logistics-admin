import React from 'react'
import { ActionIcon, FileButton, NumberInput, Textarea, TextInput, Button, } from '@mantine/core'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

import { styles } from './ItemView'


function ItemDetails({ item,  setItem }) {

  const router = useRouter().pathname

  const [isOrder] = React.useState(router.includes('/orders'))

  return (
    <div className='space-y-2'>            
      <div className={styles.block}>
        <p className={styles.label}>Дата создания</p>
        <p className={styles.value}>{dayjs(item?.createdAt?.seconds * 1000).format('DD-MM-YYYY, HH:mm')}</p>
      </div>
      {!isOrder && (
        <>
          <div className={styles.block}>
            <p className={styles.label}>Время связи</p>
            <p className={styles.value}>{`${item?.when?.[0]} ${item?.when?.[1]}`}</p>
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
          <div className={styles.block}>
            <p className={styles.label}>Whatsapp</p>
            <p className={styles.value}>{item?.wh}</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Telegram</p>
            <p className={styles.value}>{item?.tg}</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Instagram</p>
            <p className={styles.value}>{item?.instagram}</p>
          </div>
        </>
      )}

      {item?.status === 'waiting' && (
        <div className='pt-4 pb-2'>
          <p className='text-lg font-semibold mb-2'>Требуемые данные:</p>
          <p>{item?.more_data}</p>
        </div>
      )}

      <div className={styles.block}>
        <p className={styles.label}>Вид заказа</p>
        <p className={styles.value}>{item?.app}</p>
      </div>

      <div className={styles.block}>
        <p className={styles.label}>Приоритет</p>
        <p className={styles.value}>{item?.priority ? item?.priority : 'Тендер'}</p>
      </div>
      <div className={styles.block}>
        <p className={styles.label}>Название</p>
        <p className={styles.value}>{item?.title}</p>
      </div>

      <div className={styles.block}>
        <p className={styles.label}>Категория</p>
        <p className={styles.value}>{item?.category}</p>
      </div>
      <div className={styles.block}>
        <p className={styles.label}>Тип</p>
        <p className={styles.value}>{item?.type}</p>
      </div>
      

      <div className={styles.block}>
        <p className={styles.label}>Количество</p>
        {(item?.status === 'suggested' || item?.status === 'done' || item?.status === 'rejected') || (isOrder) ?
          <p className={styles.value}>{item?.count}</p>
          :
          <TextInput
            value={item?.count ?? ''}
            name='count'
            onChange={(q) => setItem({ ...item, count: q.target.value })}
          />
        }
      </div>
      <div className={styles.block}>
        <p className={styles.label}>Бюджет</p>
        {(item?.status === 'suggested' || item?.status === 'done' || item?.status === 'rejected') || (isOrder) ?
          <p className={styles.value}>{item?.cost} тг</p>
          :
          <TextInput
            value={item?.cost ?? ''}
            name='cost'
            onChange={(q) => setItem({ ...item, cost: q.target.value })}
          />
        }
      </div>

      <div className={styles.block}>
        <p className={styles.label}>Описание</p>
        {(item?.status === 'suggested' || item?.status === 'done' || item?.status === 'rejected') || (isOrder) ?
          <p className={styles.value}>{item?.description}</p>
          :
          <Textarea
            value={item?.description ?? ''}
            name='description'
            onChange={(q) => setItem({ ...item, description: q.target.value })}
            classNames={{
              input: 'h-44'
            }}
          />
        }
      </div>
      <div className={styles.block}>
        <p className={styles.label}>Срок исполнения</p>
        {(item?.status === 'suggested' || item?.status === 'done' || item?.status === 'rejected') || (isOrder) ?
          <p className={styles.value}>{item?.duration}</p>
          :
          <NumberInput
            value={item?.duration ?? ''}
            name='duration'
            onChange={(q) => setItem({ ...item, duration: q })}
            rightSection='дней'
            classNames={{
              rightSection: 'mr-4'
            }}
          />
        }
      </div>
      {/* {(item?.status === 'suggested' && !isOrder) && (
        <>
          <div className={styles.block}>
            <p className={styles.label}>Полученная сумма</p>
            <NumberInput
              value={item?.our_cost ?? ''}
              onChange={(q) => setItem({ ...item, our_cost: q })}
            />
          </div>
        </>
      )} */}
    </div>
  )
}

export default ItemDetails