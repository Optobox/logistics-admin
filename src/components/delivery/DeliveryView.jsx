import React from 'react'
import { Button, Collapse } from '@mantine/core'

import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../utlis/firebase'

import { PermissionContext } from '../../layout/Layout'
import useAuth from '../../hooks/useAuth'
import DeliveryBody from './DeliveryBody'
import DeliverySteps from './DeliverySteps'
import DeliveryNote from './DeliveryNote'
import DeliveryDetails from './DeliveryDEtails'
import { openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'

import { BiArrowToBottom } from 'react-icons/bi'

import cn from 'classnames'
import { timestamp } from '../../utlis/timestamp'

function DeliveryView({values = [], status}) {

  const {manager, logist, admin, tarif} = React.useContext(PermissionContext)

  const {user} = useAuth()

  const [item, setItem] = React.useState({})
  const [selected, setSelected] = React.useState(null)

  const active = item?.status === 'active'
  const working = item?.status === 'working'
  const tracking = item?.status === 'tracking'
  const delivered = item?.status === 'delivered'
  const prepared = item?.status === 'prepared'

  React.useEffect(() => {
    setItem(values?.find(e => e.id === item?.id))
  }, [values])

  const handleSelected = (id, item, i) => {
    setSelected(id)
    setItem(item)
  }

  const confirmActive = () => openConfirmModal({
    title: 'Подтверждение действия',
    centered: true, 
    children: (
      <p>Вы действительно хотите запустить доставку?</p>
    ),
    labels: {confirm: 'Запуустить', cancel: 'Отмена'},
    onConfirm: () => activateTrack()
  })

  const confirmTake = () => openConfirmModal({
    title: 'Подтверждение действия',
    centered: true, 
    children: (
      <p>Вы действительно хотите взять в работу доставку?</p>
    ),
    labels: {confirm: 'Взять', cancel: 'Отмена'},
    onConfirm: () => takeTrack()
  })

  const takeTrack = async () => {
    await setDoc(doc(db, 'working', item?.id), {
      ...item,
      manager: {
        uid: user?.uid,
        email: user?.email,
        displayName: user?.displayName
      },
      manager_email: user?.email,
      status: 'working',
      logist_tarif: tarif?.logist_manager
    })
    .then(async () => {
      showNotification({title: 'Доставка', message: `Доставка ${item?.id} у вас в работе!`})
      await deleteDoc(doc(db, 'active', item?.id))
      .then(() => {
        setItem(null)
      })
    })
    .catch(() => {
      showNotification({title: 'Доставка', message: `Не удалось взять доставку в работу`, color: 'red'})
    })
  }

  const activateTrack = async () => {
    await updateDoc(doc(db, 'active', item?.id), {
      ...item,
      status: 'active',
      updatedAt: timestamp,
    })
    .then(async () => {
      showNotification({title: 'Доставка', message: `Доставка ${item?.id} у вас в работе!`})
      await deleteDoc(doc(db, 'active', item?.id))
      .then(() => {
        setItem(null)
      })
    })
    .catch(() => {
      showNotification({title: 'Доставка', message: `Не удалось взять доставку в работу`, color: 'red'})
    })
  }

  const [visible, setVisible] = React.useState(false)

  return (
    <div className='grid grid-cols-1 md:grid-cols-[55%_auto]'>
      <DeliveryBody
        values={values}
        handleSelected={handleSelected}
        selected={selected}
        status={status}
      />
      {selected && (
        <div className='space-y-4 dark:bg-slate-800'>
          <DeliveryDetails
            item={item}            
            setItem={setItem}
            working={working}
          />
          {tracking && (
            <DeliverySteps
              item={item}
            />
          )}
          {prepared && (
            <Button
              onClick={confirmActive}
            >
              Запустить
            </Button>
          )}
          <p
            onClick={() => setVisible(q => !q)}
            className='flex justify-center items-center gap-x-2 cursor-pointer text-xl select-none'
          >
            Накладная
            <span className={cn('transition-all duration-200 text-2xl',{
              'rotate-180 text-blue-500': visible
            })}>
              <BiArrowToBottom/>
            </span>
          </p>

          {!active && (
            <Collapse in={visible}>
              <DeliveryNote
                item={item}
                setItem={setItem}
                working={working}
              />

            </Collapse>
          )}
          <div>
            {(!item?.manager && !item?.isTracking) && (
              <Button 
                onClick={confirmTake}
                compact
                variant='subtle'  
              >
                Принять
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}




export default DeliveryView