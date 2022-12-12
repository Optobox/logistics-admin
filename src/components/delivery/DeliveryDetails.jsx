import React from 'react'
import { Menu, Table, TextInput, Button } from '@mantine/core'
import dayjs from 'dayjs'
import { showNotification } from '@mantine/notifications'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../utlis/firebase'
import { useClipboard } from '@mantine/hooks'

function DeliveryDetails({item, setItem}) {

  const saveWeight = async () => {
    await updateDoc(doc(db, 'track', item.id), {
      deliveries: [...item?.deliveries],
      updatedAt: serverTimestamp(),
    })
    .then(e => {
      showNotification({ title: 'Вес', message: `Вес посылок успешно изменен`, color: 'green' })
    })
    .catch(e => {
      showNotification({ title: 'Вес', message: 'Не удалось изменить вес посылок', color: 'red' })
    })
  }

  const handleWeightChange = (val, index) => {
    const {name, value} = val.target
    const tempDeliveries = [...item.deliveries]
    let deliveryIndex = tempDeliveries.findIndex((_, i) => i == index)
    if (deliveryIndex != -1) {
      tempDeliveries[deliveryIndex] = {
        ...tempDeliveries[deliveryIndex], 
        [name]: value
      }
    }
    setItem({ ...item, deliveries: tempDeliveries})
  }
  
  const changeStatus = async (name, index) => {
    const tempDeliveries = [...item.deliveries]
    let deliveryIndex = tempDeliveries.findIndex((_, i) => i == index)
    if (deliveryIndex != -1) {
      tempDeliveries[deliveryIndex] = {
        ...tempDeliveries[deliveryIndex],
        status: name
      }
    }
    await updateDoc(doc(db, "track", item?.id), {
      ...item,
      deliveries: tempDeliveries,
      updatedAt: serverTimestamp(),
    })
    .then(e => {
      showNotification({ title: 'Доставка', message: `Заявка на доставку успешно обновлена!`, color: 'green' })
    })
    .catch(e => {
      showNotification({ title: 'Доставка', message: `Не удалось обновить доставку`, color: 'red' })
    })
  }

  const clipboard = useClipboard({ timeout: 500 });

  const copyTracks = () => {
    clipboard.copy(
      item.deliveries?.map((e, i) => {
        return `${i + 1}. ${e.trackID} 
`
      }).join('')
    )
  }
  
  return (
    <div className='space-y-4'>
      <Table className=''>
        <thead>
          <tr>
            <th>ID</th>
            <th>Статус</th>
            <th>Track-ID</th>
            <th>Тип товара</th>
            <th>Вес</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          {item?.deliveries?.map((e, i) => {
            return (
              <tr key={i}>
                <td>
                  {e.id}
                </td>
                <td>
                  <Menu>
                    <Menu.Target>
                      <Button
                        size='xs'
                        compact
                        variant='subtle'
                      >
                        {e.status === 'pending' && 'В обработке'}
                        {e.status === 'confirmed' && 'На складе'}
                        {e.status === 'waiting' && 'В ожидании'}
                        {e.status === 'failed' && 'Не найден'}
                        {e.status === 'canceled' && 'Отменен'}
                        {e.status === 'done' && 'Доставлено'}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={() => changeStatus('pending', i)}>В обработке</Menu.Item>
                      <Menu.Item onClick={() => changeStatus('confirmed', i)}>На складе</Menu.Item>
                      <Menu.Item onClick={() => changeStatus('waiting', i)}>В ожидании</Menu.Item>
                      <Menu.Item onClick={() => changeStatus('failed', i)}>Не найден</Menu.Item>
                      <Menu.Item onClick={() => changeStatus('canceled', i)}>Отменен</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </td>
                <td>
                  {e.trackID}
                </td>
                <td>
                  {e.type}
                </td>
                <td>
                  <TextInput 
                    value={e?.weight ?? ''} 
                    name='weight'
                    className='w-[75px]' 
                    classNames={{
                      rightSection: 'text-black'
                    }}
                    rightSection={'кг'}
                    onChange={(val) => handleWeightChange(val, i)}
                  />
                </td>
                <td className='whitespace-nowrap'>
                  {dayjs(e?.createdAt?.seconds * 1000).format('DD.MM.YY, HH:mm')}  
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      {!item?.isTracking && (
        <div className='flex justify-between gap-4 p-4' onClick={copyTracks}>
          <Button>
            Скопировать все trackID
          </Button>
          <Button onClick={saveWeight}>
            Сохранить
          </Button>
        </div>
      )}
    </div>
  )
}

export default DeliveryDetails