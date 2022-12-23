import React from 'react'
import { Button, Table } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks';
import cn from 'classnames'
import dayjs from 'dayjs';
import { AiFillLike } from 'react-icons/ai';
import { ImCoinDollar } from 'react-icons/im';
import { FaMoneyBillAlt } from 'react-icons/fa';
import quoteSeperateNumber from '../../utlis/quoteSeperator';
import { BidsContext, PermissionContext } from '../../layout/Layout';

function ItemBody({values = [], handleSelected, selected, status}) {

  const matches = useMediaQuery('(min-width: 1024px)');

  const { loadMore, loadMoreByManager } = React.useContext(BidsContext)
  const { admin } = React.useContext(PermissionContext)

  const handleLoadMore = () => {
    if (status === 'raw' || status === 'adopted') return loadMore(status)
    return loadMoreByManager(status)
  }

  return (
    <div className='bg-neutral-50 dark:bg-slate-800 h-full border-r dark:border-gray-700'>     
      <Table 
        className='h-min dark:text-gray-200 '
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Дата</th>
            {matches && <th>Cвязь</th>}
            {matches && <th>Вид</th>}
            {matches && <th>Название</th>}
            {matches && <th>Категория</th>}
            {matches && <th>Тип</th>}
            {matches && <th>Приоритет</th>}
            <th>Бюджет</th>
            <th>service</th>
            <th>purchase</th>
          </tr>
        </thead>
        <tbody>
          {values?.map((item, i) => {

            const createdAt = dayjs(item?.createdAt * 1000).format('DD.MM.YY, HH:mm')

            return (
              <tr
                key={i}
                onClick={() => handleSelected(item?.id, item)}
                className={cn('transition-all duration-200', {
                  'dark:bg-gray-600 bg-slate-200': selected == item?.id,
                })}
              >
                <td>{item?.id}</td>
                <td className='whitespace-nowrap'>
                  {createdAt}
                </td>
                {matches && <td>{`${item?.when?.[0]} - ${item?.when?.[1]}`}</td>}
                {matches && <td>{item.app}</td>}
                {matches && <td>{item.title ?? 'Тендер'}</td>}
                {matches && <td>{item.category ?? 'Тендер'}</td>}
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
                  {quoteSeperateNumber(Number(item.cost))}
                </td>
                <td>
                  {item?.service_email}
                </td>
                <td>
                  {item?.purchase_email}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <div className='flex justify-center mt-4'>
        {!admin && (
          <Button
            onClick={handleLoadMore}
            compact
            variant='subtle'
          >
            Больше данных
          </Button>
        )}
      </div>
    </div>
  )
}

export default ItemBody