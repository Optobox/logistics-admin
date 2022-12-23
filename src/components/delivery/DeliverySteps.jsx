import React from 'react'
import { Button } from '@mantine/core'
import { db } from '../../utlis/firebase'
import { arrayUnion, deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import cn from 'classnames'
import { showNotification } from '@mantine/notifications'
import { checkTime, timestamp } from '../../utlis/timestamp'

import { openConfirmModal } from '@mantine/modals'


function DeliverySteps({item}) {

  const [step, setStep] = React.useState(1)

  React.useEffect(() => {
    if (item?.isTracking) {
      setStep(item?.step)
    } 
  }, [item])

  const changeStep = async (e) => {
    e.preventDefault()
    await updateDoc(doc(db, 'track', item?.id), {
      deliveries: [...item?.deliveries],
      updatedAt: serverTimestamp(),
      step: step
    })
    .then(e => {
      showNotification({title: 'Доставка', message: 'Шаг доставки изменен', color: 'green'})
    })
    .catch(err => {
      showNotification({title: 'Доставка', message: 'Не удалось изменить шаг доставки', color: 'red'})
    }) 
  }

  const confirmEnd = () => openConfirmModal({
    title: 'Подтверждение действия',
    centered: true,
    children: (
      <p>Вы действительно хотите завершить доставку?</p>
    ),
    labels: {confirm: 'Завершить', cancel: 'Отмена'},
    onConfirm: () => endTrack()
  })

  const endTrack = async () => {
    const doneDeliveries = item?.deliveries?.map(e => {
      if (e.status === 'comming') {
        e.status = 'delivered'
      }
      return e
    })
    await setDoc(doc(db, 'delivered', item?.id), {
      ...item,
      step: 5, 
      ended: true,
      status: 'delivered',
      isTracking: false,
      deliveries: doneDeliveries,
      updatedAt: timestamp,
      endedAt: timestamp,
    })
    .then(async e => {
      await updateDoc(doc(db, 'records', item?.manager_email), {
        ['tracks-' + checkTime()]: arrayUnion({ 
          ...item, 
          step: 5, 
          ended: true,
          isTracking: false,
          status: 'delivered',
          deliveries: doneDeliveries,
          updatedAt: timestamp,
          endedAt: timestamp,
        })
      })
      .then(async() => {
        await deleteDoc(doc(db, 'tracking', item?.id))
        .then(() => {
          showNotification({title: 'Доставка', message: 'Доставка успешно завершена', color: 'green'})
        })
      })
    })
    .catch(err => {
      showNotification({title: 'Доставка', message: 'Не удалось завершить доставку', color: 'red'})
    }) 
  }

  return (
    <div className='px-4'>
      <div className='flex gap-4 mt-6'>
        {steps.map((e) => {
          return (
            <Button 
              key={e.id}
              className={cn('hover:bg-teal-400', {
                'bg-teal-400 text-white': step === e.id
              })}
              size='lg'
              onClick={() => setStep(e.id)}
              disabled={e.id === 1 || e.id === 2}
            >
              {e.id}
            </Button> 
          )
        })}
      </div>
      <div>
        {steps.map((e, i) => {
          return (
            <div key={i}>
              <div>{e.id}</div>
              <h2>{e.title}</h2>
              <p>{e.description}</p>
    
            </div>
          )
        })?.[step - 1]}
      </div>
      <div className='w-min flex gap-4'>
        {step != 5 && (
          <Button
            type='button' 
            onClick={changeStep}
            disabled={item?.day2 > timestamp}
          >
            Сохранить
          </Button>
        )}
        {step === 5 && (
          <Button
            onClick={confirmEnd}
            disabled={item?.day2 > timestamp}
          >
            Завершить
          </Button>
        )}
      </div>
    </div>
  )
}

const steps = [
  {
    id: 1, 
    title: 'title1',
    description: 'description1'
  },
  {
    id: 2, 
    title: 'title2',
    description: 'description2'
  },
  {
    id: 3, 
    title: 'title3',
    description: 'description3'
  },
  {
    id: 4, 
    title: 'title4',
    description: 'description4'
  },
  {
    id: 5, 
    title: 'title5',
    description: 'description5'
  },
]


export default DeliverySteps