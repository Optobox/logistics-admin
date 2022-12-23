import React from 'react'
import { Button, Table, Textarea } from '@mantine/core'
import { db } from '../utlis/firebase'
import { timestamp, checkTime } from '../utlis/timestamp'

import { openConfirmModal } from '@mantine/modals'

import cn from 'classnames'
import dayjs from 'dayjs'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import useAuth from '../hooks/useAuth'
import { styles } from '../components/item/ItemView'
import { ConsultContext, DataContext } from '../layout/Layout'

function ConsultView({values = [], status}) {

  const [consult, setConsult] = React.useState({})
  const [selected, setSelected] = React.useState(null)

  const {stats} = React.useContext(DataContext)

  const { loadMoreConsults } = React.useContext(ConsultContext)

  const handleSelected = (id, item) => {
    setSelected(id)
    setConsult(item)
  }
  const {user} = useAuth()

  const confirmModal = (message, status, confirmLabel, callback) => openConfirmModal({
    title: 'Подтвердите действие',
    centered: true,
    children: (
      <p>{message}</p>
    ),
    labels: { confirm: confirmLabel, cancel: 'Нет' },
    onConfirm: () => callback(status)
  })

  const rejectModal = () => openConfirmModal({
    title: 'Подтвердите действие',
    centered: true,
    children: (
      <p>Вы действительно хотите отклонить консультации</p>
    ),
    labels: { confirm: 'Отклонить', cancel: 'Нет' },
    confirmProps: {
      color: 'red',
      variant: 'outline',
    },
    onConfirm: () => rejectConsult()
  })

  const confirmConsult = async (status) => {
    await updateDoc(doc(db, 'consults', consult?.id), {
      ...consult,
      manager: {
        uid: user?.uid,
        name: user?.displayName,
        email: user?.email,
      },
      status: status,
      updatedAt: timestamp
    })
    .then(async (e) => {
      if (stats) {
        await updateDoc(doc(db, 'records', stats?.email), {
          ['consults-' + checkTime()]: arrayUnion({
            ...consult  ,
            status: status,
            updatedAt: timestamp,
            endedAt: timestamp
          })
        })
      }
    })
    .catch((err) => {
      console.log(err, 'err');
    })
  }

  const rejectConsult = async () => {
    await updateDoc(doc(db, 'consults', consult?.id), {
      ...consult,
      manager: {
        uid: user?.uid,
        name: user?.displayName,
        email: user?.email,
        comment: consult?.comment ?? null,
      },
      status: 'rejected',
      updatedAt: timestamp
    })
    .then(async (e) => {
      if (stats) {
        await updateDoc(doc(db, 'records', stats?.email), {
          ['consults-' + checkTime()]: arrayUnion({
            ...consult  ,
            status: 'rejected',
            updatedAt: timestamp,
            endedAt: timestamp
          })
        })
      }
    })
    .catch((err) => {
      console.log(err, 'err');
    })
  }

  return (
    <div className='grid grid-cols-[60%_auto] dark:bg-gray-800'>
      <div>
        <Table className='h-min '>
          <thead>
            <tr>
              <th><span className='dark:text-slate-200'>№</span></th>
              <th><span className='dark:text-slate-200'>Дата создания</span></th>
              <th><span className='dark:text-slate-200'>Время связи</span></th>
              <th><span className='dark:text-slate-200'>Имя</span></th>
              <th><span className='dark:text-slate-200'>Вопрос</span></th>
            </tr>
          </thead>
          <tbody>
            {values?.map((item, i) => {
              const createdAt = dayjs(item?.createdAt?.seconds * 1000).format('DD-MM-YYYY, HH:mm')
              return (
                <tr
                  key={i}
                  onClick={() => handleSelected(item?.id, item)}
                  className={cn('transition-all duration-200', {
                    'dark:bg-slate-600 bg-gray-200': selected == item?.id
                  })}
                >
                  <td>{item?.number}</td>
                  <td>{createdAt}</td>
                  <td>{`${item.when?.[0]} - ${item.when?.[1]}`}</td>
                  <td>{item.name}</td>
                  <td className='max-w-xs'>{item.question}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        {status === 'raw' && (
          <div className='flex justify-center mt-4'>
            <Button
              variant='subtle'
              compact
              onClick={() => loadMoreConsults('raw')}
            >
              Больше данных
            </Button>
          </div>
        )}
      </div>
      {selected && (
        <form className='p-4 space-y-4'>
          <div className='space-y-2'>
            <div className={styles.block}>
              <p className={styles.label}>Дата создания</p>
              <p className={styles.value}>{dayjs(consult?.createdAt?.seconds * 1000).format('DD-MM-YYYY, HH:mm')}</p>
            </div>
            <div className={styles.block}>
              <p className={styles.label}>Время связи</p>
              <p className={styles.value}>{`${consult?.when?.[0]} ${consult?.when?.[1]}`}</p>
            </div>
            <div className={styles.block}>
              <p className={styles.label}>Имя:</p>
              <p className={styles.value}>{consult?.name}</p>
            </div>
            <div className={styles.block}>
              <p className={styles.label}>Вопрос</p>
              <p className={styles.value}>{consult?.question}</p>
            </div>
            <div className={styles.block}>
              <p className={styles.label}>Номер телефона</p>
              <p className={styles.value}>{consult?.tel}</p>
            </div>
            <div className={styles.block}>
              <p className={styles.label}>Whatsapp</p>
              <p className={styles.value}>{consult?.wh}</p>
            </div>
            <div className={styles.block}>
              <p className={styles.label}>Почта</p>
              <p className={styles.value}>{consult?.email}</p>
            </div>
            <div className={styles.block}>
              <p className={styles.label}>Instagram</p>
              <p className={styles.value}>{consult?.instagram}</p>
            </div>
            <div className={styles.block}>
              <p className={styles.label}>Telegram</p>
              <p className={styles.value}>{consult?.tg}</p>
            </div>
          </div>
          <div className='space-y-4'>
            <Textarea
              placeholder='Введите примечание'
              value={consult?.comment}
              onChange={(e) => setConsult({...consult, comment: e.target.value})}
            >
            </Textarea>
          </div>
          <div className='space-x-4'>
            <Button 
              color={'green'} 
              px={30} 
              onClick={() => confirmModal('Вы действительно хотите принять консультацию', 'done', 'Принять', confirmConsult)} 
              disabled={!consult?.comment}
            >
              Принять
            </Button>
            <Button 
              color={'red'} 
              variant={'outline'} 
              px={30} 
              onClick={rejectModal}
            >
              Отклонить
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ConsultView