import React from 'react'
import { Button, Table } from '@mantine/core'
import dayjs from 'dayjs'
import cn from 'classnames'
import { PermissionContext, TrackContext } from '../../layout/Layout'

function DeliveryBody({values, handleSelected, selected, status}) {

  const {admin} = React.useContext(PermissionContext)

  const { loadMoreTracks, loadMoreTracksByManager } = React.useContext(TrackContext)

  const handleLoadMore = () => {
    if (status === 'active') return loadMoreTracks(status)
    return loadMoreTracksByManager(status)
  }

  const [items, setItems] = React.useState([])

  React.useEffect(() => {
    setItems(values?.filter(e => {
      return e?.status !== 'prepared' || e?.status !== 'created'
    }))
  }, [status, values])

  return (
    <div>
      <Table className='h-min dark:text-gray-100 dark:bg-slate-800 bg-gray-50'>
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
          {items?.map((item, i) => {

            const createdAt = dayjs(item?.createdAt * 1000).format('DD.MM.YYYY, HH:mm')
            const process = item?.deliveries?.find(q => q.status === 'confirmed')
            const pending = item?.deliveries?.every(q => q.status === 'pending')
            const building = item?.deliveries?.every(q => (q.status === 'confirmed') || (q.status === 'canceled'))
            const failed = item?.deliveries?.find(q => q.status === 'failed')

            return (
              <tr 
                key={i} 
                onClick={() => handleSelected(item?.id, item, i)}
                className={cn('transition-all duration-200', {
                  'dark:bg-slate-500 bg-slate-200': selected == item?.id
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

export default DeliveryBody