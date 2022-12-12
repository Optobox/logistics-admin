import React from 'react'
import { Button, Table, Textarea } from '@mantine/core'
import { db } from '../utlis/firebase'

import { openConfirmModal } from '@mantine/modals'

import cn from 'classnames'
import dayjs from 'dayjs'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import useAuth from '../hooks/useAuth'
import { styles } from '../components/item/ItemView'

function ConsultView({values = []}) {

  const [consult, setConsult] = React.useState({})
  const [selected, setSelected] = React.useState(null)

  const handleSelected = (id, item) => {
    setSelected(id)
    setConsult(item)
  }
  const {user} = useAuth()

  const confirmModal = () => openConfirmModal({
    title: 'Подтвердите действие',
    centered: true,
    children: (
      <p>Вы действительно хотите принять консультацию</p>
    ),
    labels: { confirm: 'Принять', cancel: 'Нет' },
    onConfirm: () => confirmConsult()
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

  const confirmConsult = async () => {
    await updateDoc(doc(db, 'consults', consult?.id), {
      ...consult,
      manager: {
        uid: user?.uid,
        name: user?.displayName,
        email: user?.email,
      },
      status: 'done',
      updatedAt: serverTimestamp()
    })
    .then((e) => {
      console.log(e, 'succ');
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
        comment: comment ?? null,
      },
      status: 'rejected',
      updatedAt: serverTimestamp()
    })
      .then((e) => {
        console.log(e, 'succ');
      })
      .catch((err) => {
        console.log(err, 'err');
      })
  }

  return (
    <div className='grid grid-cols-[60%_auto] dark:bg-gray-800'>
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
            <Button color={'green'} px={30} onClick={confirmModal} disabled={!consult?.comment}>
              Принять
            </Button>
            <Button color={'red'} variant={'outline'} px={30} onClick={rejectModal}>
              Отклонить
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ConsultView