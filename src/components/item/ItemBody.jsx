import React from 'react'
import { Table } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks';
import cn from 'classnames'
import dayjs from 'dayjs';
import { AiFillLike } from 'react-icons/ai';
import { ImCoinDollar } from 'react-icons/im';
import { FaMoneyBillAlt } from 'react-icons/fa';


function ItemBody({values = [], handleSelected, selected}) {

  const matches = useMediaQuery('(min-width: 1024px)');

  return (
    <div>
      <Table className='h-min'>
        <thead>
          <tr>
            <th>№</th>
            <th>Дата</th>
            {matches && <th>Cвязь</th>}
            <th>Вид</th>
            <th>Название</th>
            <th>Категория</th>
            {matches && <th>Тип</th>}
            {matches && <th>Приоритет</th>}
            <th>Бюджет</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {values?.map((item, i) => {

            const createdAt = dayjs(item?.createdAt?.seconds * 1000).format('DD.MM.YY, HH:mm')

            return (
              <tr
                key={i}
                onClick={() => handleSelected(item?.id, item)}
                className={cn('transition-all duration-200', {
                  'bg-slate-100': selected == item?.id,
                })}
              >
                <td>
                  {item?.number}
                </td>
                <td className='whitespace-nowrap'>
                  {createdAt}
                </td>
                {matches && <td>{`${item?.when?.[0]} ${item?.when?.[1]}`}</td>}
                <td>
                  {item.app}
                </td>
                <td>
                  {item.title}
                </td>
                <td>
                  {item.category}
                </td>
                {matches && <td>{item.type?.replace('товар', '')}</td>}
                {matches && (
                  <td>
                    {(item?.priority === 'Средняя цена - высшее качество') && (
                      <p className='flex gap-2 items-center'>
                        <AiFillLike className='text-xl fill-pink-400' /> 
                        Качество
                      </p>
                    )}
                    {(item?.priority === 'Низкая цена - хорошее качество') && (
                      <p className='flex gap-2 items-center'>
                        <ImCoinDollar className='text-xl fill-slate-400' /> 
                        Цена
                      </p>
                    )}
                    {!item?.priority && (
                      <p className='flex gap-2 items-center'>
                        <FaMoneyBillAlt className='text-green-400 text-xl' /> 
                        Тендер  
                      </p>
                    )}
                  </td>
                )}
                <td>
                  {item.cost}
                </td>
                <td>
                  {item.status}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default ItemBody