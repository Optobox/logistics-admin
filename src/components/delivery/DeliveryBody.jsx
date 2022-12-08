import React from 'react'
import { Table } from '@mantine/core'
import dayjs from 'dayjs'
import cn from 'classnames'


function DeliveryBody({values, handleSelected, selected}) {
  return (
    <Table className='h-min'>
      <thead>
        <tr>
          <th>Имя</th>
          <th>Почта</th>
          <th>Маркировка</th>
          <th>Статус</th>
          <th>Страна</th>
          <th>Дата создания</th>
        </tr>
      </thead>
      <tbody>
        {values?.map((item, i) => {

          const createdAt = dayjs(item?.createdAt?.seconds * 1000).format('DD.MM.YYYY, HH:mm')
          const process = item?.deliveries?.find(q => q.status === 'confirmed')
          const pending = item?.deliveries?.every(q => q.status === 'pending')
          const building = item?.deliveries?.every(q => (q.status === 'confirmed') || (q.status === 'canceled'))
          const failed = item?.deliveries?.find(q => q.status === 'failed')

          return (
            <tr 
              key={i} 
              onClick={() => handleSelected(item?.id, item, i)}
              className={cn('transition-all duration-200', {
                'bg-slate-200': selected == item?.id
              })}
            >
              <td>
                {item.user?.displayName}
              </td>
              <td>
                {item.user?.email}
              </td>
              <td>
                {item.markup}
              </td>
              <td>
                {pending && 'В обработке'}
                {(process && !failed && !building) && 'В процессе'}
                {building && 'Сборка'}
                {failed && 'Решение...'}
              </td>
              <td>
                {item?.city === 'kz' && 'Казахстан'}
                {item?.city === 'ru' && 'Россия'}
              </td>
              <td>
                {createdAt}
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default DeliveryBody