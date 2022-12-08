import React from 'react'
import { Button } from '@mantine/core'
import { db } from '../../utlis/firebase'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import cn from 'classnames'
import { showNotification } from '@mantine/notifications'


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

  const endTrack = async () => {
    const doneDeliveries = item?.deliveries?.map(e => {
      if (e.status === 'confirmed') {
        e.status = 'done'
      }
      return e
    })
    await updateDoc(doc(db, 'track', item?.id), {
      step: 5, 
      ended: true,
      isTracking: false,
      deliveries: doneDeliveries,
      updatedAt: serverTimestamp(),
      endedAt: serverTimestamp(),
    })
    .then(e => {
      showNotification({title: 'Доставка', message: 'Доставка успешно завершена', color: 'green'})
    })
    .catch(err => {
      showNotification({title: 'Доставка', message: 'Не удалось завершить доставку', color: 'red'})
    }) 
  }



  return (
    <div>
      <div className='flex gap-4 mt-6'>
        {steps.map((e) => {
          return (
            <div 
              key={e.id}
              className={cn('py-4 px-6 border-2 rounded text-xl transition-all duration-200 cursor-pointer', {
                'bg-teal-400 text-white': step === e.id
              })}
              onClick={() => setStep(e.id)}
            >
              {e.id}
            </div> 
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
            >
            Сохранить
          </Button>
        )}
        {step === 5 && (
          <Button
            onClick={endTrack}
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