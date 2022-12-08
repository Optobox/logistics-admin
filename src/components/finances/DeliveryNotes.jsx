import { Table } from '@mantine/core'
import React from 'react'
import { DataContext } from '../../layout/Layout'

import cn from 'classnames'
import { styles } from '../item/ItemView'
import dayjs from 'dayjs'

function DeliveryNotes() {

  const {tracks} = React.useContext(DataContext)

  const values = tracks?.filter((e) => {
    return e?.ended
  })

  const [item, setItem] = React.useState({})
  const [selected, setSelected] = React.useState(null)

  const handleSelected = (id, item) => {
    setSelected(id)
    setItem(item)
  }

  return (
    <div className='grid grid-cols-1 2xl:grid-cols-[65%_35%] w-full'>
      <Table className='h-min'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Доход </th>
            <th>Вес</th>
            <th>Куб</th>
            <th>Прибыль</th>
            <th>Логист доход</th>
            <th>Opto прибыль</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          {values?.map((e, i) => {

            const prib = (Number(e?.weight) * Number(e?.our_cost)); 

            const logistPrib = (prib * e?.logist_tarif) / 100
            const optoPrib = prib - logistPrib

            return (
              <tr
                ke y={i}
                onClick={() => handleSelected(e?.id, e)}
                className={cn('transition-all duration-200', {
                  'bg-slate-100': selected == e?.id,
                })}
              >
                <td>{e?.id}</td>
                <td>{e?.total_cost}</td>
                <td>{e?.weight}</td>
                <td>{e?.cube}</td>
                <td>{prib}</td>
                <td>{logistPrib}</td>
                <td>{optoPrib}</td>
                <td>{optoPrib}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      {selected && (
        <div className='space-y-4 border p-4'>
          <div className={styles.block}>
            <p className={styles.label}>Дата создания:</p>
            <p className={styles.value}>{dayjs(item?.createdAt?.seconds * 1000).format('DD-MM-YYYY, HH:mm')}</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Пользователь markup:</p>
            <p className={styles.value}>{item?.markup}</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Пользователь почта:</p>
            <p className={styles.value}>{item?.user?.email}</p>
          </div>
          {item?.insurance && (
            <div className={styles.block}>
              <p className={styles.label}>Стоимость страховки:</p>
              <p className={styles.value}>{item?.insurance}</p>
            </div>
          )}

          <div className={styles.block}>
            <p className={styles.label}>Количество коробок:</p>
            <p className={styles.value}>{item?.boxes}</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Стоимость за куб:</p>
            <p className={styles.value}>{item?.cube_cost}</p>
          </div>
   
          <div className={styles.block}>
            <p className={styles.label}>Стоимость за кг:</p>
            <p className={styles.value}>{item?.weight_cost}</p>
          </div>

          <div className={styles.block}>
            <p className={styles.label}>Сборка товара:</p>
            <p className={styles.value}>{item?.pack_cost}</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Упаковка:</p>
            <p className={styles.value}>
              {item?.pack?.map((e, i) => {
                return (e === 'carton' && 'Картон ') || (e === 'bag' && 'Мешок')
              })}
            </p>
          </div>

          {item?.carcas && (
            <div className={styles.block}>
              <p className={styles.label}>Каркас-обрешетка:</p>
              <p className={styles.value}>{item?.carcas}</p>
            </div>
          )}
      
        </div>
      )}
    </div>
  )
}

export default DeliveryNotes