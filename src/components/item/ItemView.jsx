import React from 'react'
import { Button, NumberInput, Textarea, TextInput, Collapse } from '@mantine/core'
import { db, storage } from '../../utlis/firebase'

import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'

import { PermissionContext } from '../../layout/Layout'
import { deleteObject, ref } from 'firebase/storage'
import ItemBody from './ItemBody'
import { useRouter } from 'next/router'
import ItemDetails from './ItemDetails'
import useAuth from '../../hooks/useAuth'
import ItemImages from './ItemImages'

export const styles = {
  block: "grid grid-cols-[30%_auto]",
  label: "text-sm",
  value: "text-sm",
};

export const ItemContext = React.createContext(null)

function ItemView({ values = [] }) {

  const { manager, service, admin, purchase, tarif } = React.useContext(PermissionContext)

  const {user} = useAuth()

  const [item, setItem] = React.useState({})
  const [selected, setSelected] = React.useState(null)

  const handleSelected = (id, item) => {
    setSelected(id)
    setItem(item)
  }

  const suggested = item?.status === 'suggested'
  const raw = item?.status === 'raw'
  const adopted = item?.status === 'adopted'
  const done = item?.status === 'done'
  const ended = item?.status === 'ended'
  const rejected = item?.status === 'rejected'
  const waiting = item?.status === 'waiting'
  const same = item?.same

  const confirmModal = (message, status, confirmLabel, callback, cancelLabel = 'Нет') => openConfirmModal({
    title: 'Подтвердите действие',
    centered: true,
    children: (
      <p>{message}</p>
    ),
    labels: { confirm: confirmLabel, cancel: cancelLabel },
    onConfirm: () => callback(status)
  })

  const clearItem = () => {
    setItem(null)
    setSelected(null)
    setAgain(false)
  }

  const adoptItem = async (status) => {
    await updateDoc(doc(db, 'items', item?.id), {
      ...item,
      urls: null,
      service_manager: {
        uid: user?.uid,
        name: user?.displayName,
        email: user?.email,
      },
      service_tarif: tarif.service_manager,
      purchase_tarif: tarif.purchase_manager,
      status: status,
      updatedAt: serverTimestamp(),
    })
    .then((e) => {
      clearItem()
    })
    .catch((err) => {
      console.log(err, 'err');
    })
  }

  const sendItem = async (status) => {
    await updateDoc(doc(db, 'items', item?.id), {
      ...item,
      urls: (urls && [...urls]) ?? null,
      purchase_manager: {
        uid: user?.uid,
        name: user?.displayName,
        email: user?.email,
      },
      status: status,
      updatedAt: serverTimestamp(),
    })
    .then((e) => {
      clearItem()
    })
    .catch((err) => {
      console.log(err, 'err');
    })
  }

  const moreDataItem = async (status) => {
    await updateDoc(doc(db, 'items', item?.id), {
      ...item,
      urls: (urls && [...urls]) ?? null,
      more_data: item?.more_data,
      purchase_manager: {
        uid: user?.uid,
        name: user?.displayName,
        email: user?.email,
      },
      status: status,
      updatedAt: serverTimestamp(),
    })
    .then((e) => {
      clearItem()
    })
    .catch((err) => {
      console.log(err, 'err');
    })
  }

  const sameItem = async (status) => {
    await updateDoc(doc(db, 'items', item?.id), {
      ...item,
      urls: (urls && [...urls]) ?? null,
      same: true,
      status: status,
      service_tarif: tarif.service_manager,
      purchase_tarif: 0,
      updatedAt: serverTimestamp(),
    })
    .then((e) => {
      clearItem()
    })
    .catch((err) => {
      console.log(err, 'err');
    })
  }

  const rejectItem = async (status) => {
    await updateDoc(doc(db, 'items', item?.id), {
      ...item,
      urls: null,
      status: status,
      reject_status: item?.status,
      service_manager: null,
      purchase_manager: null,
      updatedAt: serverTimestamp(),
    })
    .then(async (e) => {
      if (item?.urls) {
        item?.urls?.map((url, i) => {
          if (url?.specs) {
            deleteObject(ref(storage, `/items/${item?.id}/specs-${i}`)) 
          }
          if (url?.good) {
            deleteObject(ref(storage, `/items/${item?.id}/good-${i}`)) 
          }
          if (url?.extra) {
            deleteObject(ref(storage, `/items/${item?.id}/extra-${i}`)) 
          }
        })
      }
      setItem(null)
    })
    .catch((err) => {
      console.log(err, 'err');
    })
  }

  const restoreItem = async (status) => {
    await updateDoc(doc(db, 'items', item?.id), {
      ...item,
      status: status,
      restored: true,
      updatedAt: serverTimestamp(),
      service_tarif: null,
      purchase_tarif: null,
    })
    .then((e) => {
      clearItem()
    })
    .catch((err) => {
      console.log(err, 'err');
    })
  }

  const reAdoptItem = async (status) => {
    await updateDoc(doc(db, 'items', item?.id), {
      ...item,
      cost: newItem?.cost,
      count: newItem?.count,
      description: newItem?.description,
      duration: newItem?.duration,
      urls: (urls && [...urls]) ?? null,
      status: status,
      updatedAt: serverTimestamp(),
      same: false
    })
    .then((e) => {
      clearItem()
    })
    .catch((err) => {
      console.log(err, 'err');
    })
  }
  
  const concludeItem = async (status) => {
    await updateDoc(doc(db, 'items', item?.id), {
      ...item,
      recieved_sum: item?.recieved_sum,
      status: status,
      updatedAt: serverTimestamp(),
    })
    .then((e) => {
      clearItem()
    })
    .catch((err) => {
      console.log(err, 'err');
    })
  }

  const endItem = async (status) => {
    await updateDoc(doc(db, 'items', item?.id), {
      ...item,
      recieved_sum: item?.recieved_sum,
      status: status,
      updatedAt: serverTimestamp(),
      endedAt: serverTimestamp()
    })
    .then((e) => {
      clearItem()
    })
    .catch((err) => {
      console.log(err, 'err');
    })
  }

  const saveItem = async () => {
    await updateDoc(doc(db, 'items', item?.id), {
      ...item,
      urls: [...urls],
      updatedAt: serverTimestamp()
    })
    .then(() => {
      showNotification({ title: 'Заявки', message: 'Заявка сохранена', color: 'green' })
    })
    .catch(err => {
      showNotification({ title: 'Заявки', message: 'Не удалось сохранить заявку сохранена', color: 'green' })
    })
  }

  const rejectModal = (message, status, confirm, cancel = 'Нет') => openConfirmModal({
    title: 'Подтвердите действие',
    centered: true,
    children: (
      <>
        <p className='mb-4'>{message}</p>  
        <Textarea
          label='Примечание'
          onChange={(e) => setItem({...item, reject_comment: e.target.value})}
        />
      </>
    ),
    labels: { confirm: confirm, cancel: cancel },
    confirmProps: {
      color: 'red',
      variant: 'outline',
      disabled: !item?.reject_comment
    },
    onConfirm: () => rejectItem(status)
  })

  const [urls, setUrls] = React.useState([{
    link: '',
    cost: '',
    specs: null,
    good: null,
    extra: null
  }])


  React.useEffect(() => {
    if (item?.urls) {
      setUrls(item?.urls)
    } else {
      setUrls([{ link: '', cost: null, specs: null, good: null, extra: null }])
    }
  }, [item?.urls])

  const [again, setAgain] = React.useState(false)

  const [newItem, setNewItem] = React.useState({})

  const reAdopt = () => {
    setNewItem({
      cost: item?.cost, 
      count: item?.count, 
      description: item?.description, 
      duration: item?.duration
    })
    setAgain(true)
  }

  const router = useRouter().pathname

  const [isOrder] = React.useState(router.includes('/orders'))

  return (
    <>
      <ItemContext.Provider value={{suggested, adopted, raw, waiting, ended, done, rejected, same}}>
        <div className='grid grid-cols-1 xl:grid-cols-[65%_35%] w-full'>
          <ItemBody 
            values={values} 
            handleSelected={handleSelected} 
            selected={selected} 
          />
          {selected && (
            <div>
              <ItemDetails  
                item={item}
                setItem={setItem}
              />
              <ItemImages
                item={item}
                setItem={setItem}
                saveItem={saveItem}
                urls={urls}
                setUrls={setUrls}
                sendItem={sendItem}
                confirmModal={confirmModal}
              />
              {isOrder ? 
                <form className='px-4 space-y-4'>
                  <div className='space-y-2'>
                    {((!service || manager) && (service || !manager)) && (
                      <>
                        {adopted && (
                          <div className='space-y-4'>
                            <Textarea
                              value={item?.more_data ?? ''}
                              onChange={e => setItem({ ...item, more_data: e.target.value })}
                            />
                            <Button
                              onClick={() => confirmModal('Вы действительно хотите подтребовать больше данных?', 'waiting', 'Больше данных', moreDataItem)}
                              disabled={!item?.more_data}
                            >
                              Больще данных
                            </Button>
                          </div>
                        )}
                        {waiting && (
                          <div>
                            <p className='text-lg font-semibold mb-2'>Требуемые данные:</p>
                            <p>{item?.more_data}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </form>
              :
                <form className='p-4 space-y-4'>
                  <div className='space-y-2'>
                    {suggested && (
                      <div className={styles.block}>
                        <p className={styles.label}>Полученная сумма</p>
                        <NumberInput
                          value={item?.recieved_sum ?? ''}
                          onChange={(q) => setItem({ ...item, recieved_sum: q })}
                        />
                      </div>
                    )}
                    {done && (
                      <Button
                        color={'green'}
                        onClick={() => confirmModal('Вы действительно хотите завершить заявку?', 'ended', 'Подтвердить', endItem)}
                      >
                        Завершить
                      </Button>
                    )}
                    <div className='space-x-4'>
                      {waiting && (
                        <Button
                          color={'green'}
                          onClick={() => confirmModal('Вы действительно хотите принять заявку?', 'adopted', 'Подтвердить', adoptItem)}
                        >
                          Принять
                        </Button>
                      )}
                      {suggested && (
                        <Button
                          color={'green'}
                          onClick={() => confirmModal('Вы действительно хотите заключить заявку?', 'done', 'Подтвердить', concludeItem)}
                          disabled={again || !item?.recieved_sum}
                        >
                          Заключить
                        </Button>
                      )}
                      {raw && (
                        <>
                          <Button
                            color={'green'}
                            disabled={!item?.duration}
                            onClick={() => confirmModal('Вы действительно хотите принять заявку?', 'adopted', 'Подтвердить', adoptItem)}
                          >
                            Принять
                          </Button>
                        {!same && (
                          <Button
                            color={'green'}
                            onClick={() => confirmModal('Вы действительно хотите принять заявку?', 'suggested', 'Подтвердить', sameItem)}
                          >
                            Похожий заказ
                          </Button>
                        )}
                        </>
                      )}
                      {(admin && rejected) && (
                        <Button 
                          color={'green'} 
                          variant={'outline'}
                          onClick={() => confirmModal('Вы действительно хотите восстановить заявку?', 'raw', 'Восстановить', restoreItem)}
                        >
                          Восстановить
                        </Button>
                      )}
                      {(raw || adopted || suggested || waiting) && (
                        <Button 
                          color={'red'} 
                          variant={'outline'}
                          onClick={() => rejectModal('Вы действительно хотите принять заявку?', 'rejected', 'Отклонить', rejectItem)}
                        >
                          Отклонить
                        </Button>
                      )}
                        
                      {suggested && (
                        <Button
                          color={'yellow'}
                          onClick={reAdopt}
                          variant='subtle'
                        >
                          Переподача
                        </Button>
                      )}
                    </div>
                    <Collapse in={again}>
                      <div className='space-y-4 mt-6'>
                        <div className={styles.block}>
                          <p className={styles.label}>Количество</p>
                            <TextInput
                              value={newItem?.count ?? ''}
                              name='count'
                              onChange={(q) => setNewItem({ ...newItem, count: q.target.value })}
                            />
                        </div>
                        <div className={styles.block}>
                          <p className={styles.label}>Бюджет</p>
                            <TextInput
                              value={newItem?.cost ?? ''}
                              name='cost'
                              onChange={(q) => setNewItem({ ...newItem, cost: q.target.value })}
                            />
                        </div>

                        <div className={styles.block}>
                          <p className={styles.label}>Описание</p>
                            <Textarea
                              value={newItem?.description ?? ''}
                              name='description'
                              onChange={(q) => setNewItem({ ...newItem, description: q.target.value })}
                              classNames={{
                                input: 'h-44'
                              }}
                            />
                        </div>
                        <div className={styles.block}>
                          <p className={styles.label}>Срок исполнения</p>
                            <NumberInput
                              value={newItem?.duration ?? ''}
                              name='duration'
                              onChange={(q) => setNewItem({ ...newItem, duration: q })}
                              rightSection='дней'
                              classNames={{
                                rightSection: 'mr-4'
                              }}
                            />
                          </div>
                        <div className='space-x-4'>
                          <Button
                            color={'yellow'}
                            onClick={() => confirmModal('Вы действительно хотите переподать заявку?', 'adopted', 'Переподать', reAdoptItem)}
                          >
                            Переподача
                          </Button>
                          <Button
                            color={'yellow'}
                            onClick={() => setAgain(false)}
                            variant='subtle'
                          >
                            Отмена
                          </Button>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                </form>
              }
            </div>
          )}
        </div>
      </ItemContext.Provider>
    </>
  )
}

export default ItemView