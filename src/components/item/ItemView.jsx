import React from 'react'
import { ActionIcon, Button, NumberInput, Textarea, TextInput, FileButton, Modal, Collapse } from '@mantine/core'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db, storage } from '../../utlis/firebase'

import dayjs from 'dayjs'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'

import { AiFillDelete } from 'react-icons/ai'
import { PermissionContext } from '../../layout/Layout'
import { uploadAndGetImage } from '../../utlis/upload'
import { deleteObject, ref } from 'firebase/storage'
import Compressor from 'compressorjs'
import ItemBody from './ItemBody'
import { useRouter } from 'next/router'
import ItemDetails from './ItemDetails'

export const styles = {
  block: 'grid grid-cols-[30%_auto]',
  label: 'font-semibold',
  value: 'font-semibold'
}

function ItemView({ values = [] }) {

  const { manager, service, admin, purchase } = React.useContext(PermissionContext)

  const [user] = useAuthState(auth)

  const [item, setItem] = React.useState({})
  const [selected, setSelected] = React.useState(null)

  const handleSelected = (id, item) => {
    setSelected(id)
    setItem(item)
  }

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
      our_cost: item?.our_cost,
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
      our_cost: item?.our_cost,
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
    if (!item?.urls) return setUrls([{ link: '', cost: null, specs: null, good: null, extra: null }])
    setUrls(item?.urls)
  }, [item])

  React.useEffect(() => {
    if (item?.urls) {
      setUrls(item?.urls)
    }
  }, [item?.urls])

  const handleUrlChange = async (val, name, index) => {
    if (name === 'specs' || name === 'good' || name === 'extra') {
      const files = urls.map((e, i) => {
        if (i === index) {
          return { ...e, [name]: val }
        } else {
          return e
        }
      })
      new Compressor(val, {
        quality: 0.6,
        async success(file) {
          await uploadAndGetImage(`items/${item?.id}/${name}-${index}`, file)
          .then((async e => {
            if (name === 'specs') {
              files[index].specs = e
            } 
            if (name === 'good') {
              files[index].good = e
            } 
            if (name === 'extra') {
              files[index].extra = e
            } 
            setUrls(files)
            await updateDoc(doc(db, 'items', item?.id), {
              urls: files
            })
          }))
        } 
      })
      return  
    }

    const newUrls = urls.map((e, i) => {
      if (i === index) {
        return { ...e, [name]: val }
      } else {
        return e
      }
    })

    setUrls(newUrls)
  }

  const  deleteFiles = async (name, index) => {
    await deleteObject(ref(storage, `items/${item?.id}/${name}-${index}`)) 
    .then(async () => {
      const newUrls = urls.map((e, i) => {
        if (i === index) {
          return { ...e, [name]: null}
        } else {
          return e
        }
      })
      await updateDoc(doc(db, 'items', item?.id), {
        urls: newUrls
      })
      .then(() => {
        setUrls(newUrls)
      })
    })
  }

  const addUrl = () => {
    setUrls([...urls, { link: '', cost: null, good: null, specs: null, extra: null }])
  }

  const deleteUrl = (i) => {
    setUrls(q => q.filter((_, index) => {
      return index !== i
    })
    )
  }

  const [modal, setModal] = React.useState({
    value: false, 
    src: null
  })

  const handleImageView = (url) => {
    setModal({value: true, src: url})
  }

  const [again, setAgain] = React.useState(false)

  const [newItem, setNewItem] = React.useState({
    cost: null, 
    count: null, 
    description: null, 
    duration: null
  })

  React.useEffect(() => {
    setNewItem({
      cost: item?.cost, 
      count: item?.count, 
      description: item?.description, 
      duration: item?.duration
    })
    setAgain(false)
  }, [item])

  const router = useRouter().pathname

  const [isOrder] = React.useState(router.includes('/orders'))

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-[60%_auto]'>
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
            {isOrder ? 
              <form className='border p-4 space-y-4'>
                <div className='space-y-2'>
                  {/* <div className={styles.block}>
                    <p className={styles.label}>Дата создания</p>
                    <p className={styles.value}>{dayjs(item?.createdAt?.seconds * 1000).format('DD-MM-YYYY, HH:mm')}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Срок исполнения:</p>
                    <p className={styles.value}>{item?.duration}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Вид заказа</p>
                    <p className={styles.value}>{item?.app}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Приоритет</p>
                    <p className={styles.value}>{item?.priority ? item?.priority : 'Тендер'}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Название</p>
                    <p className={styles.value}>{item?.title}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Категория</p>
                    <p className={styles.value}>{item?.category}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Тип</p>
                    <p className={styles.value}>{item?.type}</p>
                  </div>

                  <div className={styles.block}>
                    <p className={styles.label}>Количество</p>
                    <p className={styles.value}>{item?.count ?? ''}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Бюджет</p>
                    <p className={styles.value}>{item?.cost ?? ''} тг</p>
                  </div>

                  <div className={styles.block}>
                    <p className={styles.label}>Описание</p>
                    <p className={styles.value}>{item?.description ?? ''} </p>
                  </div> */}
                  {((!service || manager) && (service || !manager)) && (
                    <>
                      {(item?.status === 'suggested' || item?.status === 'done') &&
                        <>
                          {item?.urls?.map((e, i) => {
                            return (
                              <div key={i}>
                                <p className='flex items-center gap-4'>
                                  <span className='font-semibold w-24'>Ссылка:</span>
                                  {e.link}
                                </p>
                                <p className='flex items-center gap-4'>
                                  <span className='font-semibold w-24'>Стоимость:</span>
                                  {e.cost} тг
                                </p>
                                {e?.specs && (
                                  <p className='flex items-center gap-4'>
                                    <span className='font-semibold w-24'>Характеристика:</span>
                                    <img src={e.specs} className='w-24' onClick={() => handleImageView(e.specs)} alt="" />
                                  </p>
                                )}
                                {e?.good && (
                                  <p className='flex items-center gap-4'>
                                    <span className='font-semibold w-24'>Товар:</span>
                                    <img src={e.good} className='w-24' onClick={() => handleImageView(e.good)} alt="" />
                                  </p>
                                )}
                                {e?.extra && (
                                  <p className='flex items-center gap-4'>
                                    <span className='font-semibold w-24'>Доп:</span>
                                    <img src={e.extra} className='w-24' onClick={() => handleImageView(e.extra)} alt="" />
                                  </p>
                                )}
                              </div>
                            )
                          })}
                        </>}
                      {item?.status === 'adopted' && (
                        <>
                          {urls?.map((e, i) => {
                            return (
                              <React.Fragment key={i}>
                                <div className='flex gap-4 items-center pr-6' key={i}>
                                  <TextInput
                                    className='w-full'
                                    value={e.link ?? ''}
                                    onChange={(v) => handleUrlChange(v.target.value, 'link', i)}
                                    name='link'
                                  />
                                  <NumberInput
                                    className='w-72'
                                    value={e.cost}
                                    onChange={(v) => handleUrlChange(v, 'cost', i)}
                                    name='cost'
                                    decimalSeparator='.'
                                  />
                                  {i >= 1 && (
                                    <ActionIcon
                                      color={'red'}
                                      variant='subtle'
                                      className='-mr-8 -ml-3'
                                      onClick={() => deleteUrl(i)}
                                    >
                                      <AiFillDelete />
                                    </ActionIcon>
                                  )}
                                </div>
                                <div className='flex justify-between'>
                                  <div>
                                      {urls?.[i]?.specs && (
                                        <div className='flex items-center'>
                                          <img 
                                            src={urls[i].specs} 
                                            alt="" 
                                            className='w-24 h-24' 
                                            onClick={() => handleImageView(e.specs)} 
                                          />
                                          <Button 
                                            compact 
                                            color={'red'} 
                                            variant={'subtle'} 
                                            onClick={() => deleteFiles('specs', i)}
                                          >
                                            удалить
                                          </Button>
                                        </div>
                                      )}
                                    <FileButton 
                                      onChange={(e) => handleUrlChange(e, 'specs', i)} 
                                      compact 
                                      variant='subtle'
                                    >
                                      {(props) => <Button {...props}>добавить</Button>}
                                    </FileButton>
                                  </div>
                                  <div>
                                      {urls?.[i]?.good && (
                                        <div className='flex items-center'>
                                          <img 
                                            src={urls[i].good} 
                                            alt=""  
                                            className='w-24 h-24' 
                                            onClick={() => handleImageView(e.good)}
                                          />
                                          <Button 
                                            compact 
                                            color={'red'} 
                                            variant={'subtle'} 
                                            onClick={() => deleteFiles('good', i)}
                                          >
                                            удалить
                                          </Button>
                                        </div>
                                      )}
                                    <FileButton 
                                      onChange={(e) => handleUrlChange(e, 'good', i)} 
                                      compact 
                                      variant='subtle'
                                    >
                                      {(props) => <Button {...props}>добавить</Button>}
                                    </FileButton>
                                  </div>
                                  <div>
                                      {urls?.[i]?.extra && (
                                        <div className='flex items-center'>
                                          <img 
                                            src={urls[i].extra} 
                                            alt=""  
                                            className='w-24 h-24' 
                                            onClick={() => handleImageView(e.extra)}
                                          />
                                          <Button 
                                            compact 
                                            color={'red'} 
                                            variant={'subtle'} 
                                            onClick={() => deleteFiles('extra', i)}
                                          >
                                            удалить
                                          </Button>
                                        </div>
                                      )}
                                    <FileButton 
                                      onChange={(e) => handleUrlChange(e, 'extra', i)} 
                                      compact 
                                      variant='subtle'
                                    >
                                      {(props) => <Button {...props}>добавить</Button>}
                                    </FileButton>
                                  </div>
                                </div>
                              </React.Fragment>
                            )
                          })}
                          
                          <div className='flex justify-between gap-4'>
                            <Button variant='subtle' compact onClick={addUrl}>
                              Добавить еще
                            </Button>
                            <Button onClick={saveItem}>
                              Сохранить
                            </Button>
                          </div>
                          <Button
                            color={'green'}
                            className='mt-4'
                            onClick={() => confirmModal('Вы действительно хотите отправить заявку?', 'suggested', 'Отправить', sendItem)}
                          >
                            Отправить
                          </Button>
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
                        </>
                      )}
                      {item?.status === 'waiting' && (
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
              <form className='border p-4 space-y-4'>
                <div className='space-y-2'>
                  {/* <div className={styles.block}>
                    <p className={styles.label}>Дата создания</p>
                    <p className={styles.value}>{dayjs(item?.createdAt?.seconds * 1000).format('DD-MM-YYYY, HH:mm')}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Время связи</p>
                    <p className={styles.value}>{`${item?.when?.[0]} ${item?.when?.[1]}`}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Имя:</p>
                    <p className={styles.value}>{item?.name}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Город</p>
                    <p className={styles.value}>{item?.city}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Номер телефона</p>
                    <p className={styles.value}>{item?.tel}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Whatsapp</p>
                    <p className={styles.value}>{item?.wh}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Telegram</p>
                    <p className={styles.value}>{item?.tg}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Instagram</p>
                    <p className={styles.value}>{item?.instagram}</p>
                  </div>

                  {item?.status === 'waiting' && (
                    <div className='pt-4 pb-2'>
                      <p className='text-lg font-semibold mb-2'>Требуемые данные:</p>
                      <p>{item?.more_data}</p>
                    </div>
                  )}

                  <div className={styles.block}>
                    <p className={styles.label}>Вид заказа</p>
                    <p className={styles.value}>{item?.app}</p>
                  </div>

                  <div className={styles.block}>
                    <p className={styles.label}>Приоритет</p>
                    <p className={styles.value}>{item?.priority ? item?.priority : 'Тендер'}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Название</p>
                    <p className={styles.value}>{item?.title}</p>
                  </div>

                  <div className={styles.block}>
                    <p className={styles.label}>Категория</p>
                    <p className={styles.value}>{item?.category}</p>
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Тип</p>
                    <p className={styles.value}>{item?.type}</p>
                  </div>

                  <div className={styles.block}>
                    <p className={styles.label}>Количество</p>
                    {(item?.status === 'suggested' || item?.status === 'done' || item?.status === 'rejected') ?
                      <p className={styles.value}>{item?.count}</p>
                      :
                      <TextInput
                        value={item?.count ?? ''}
                        name='count'
                        onChange={(q) => setItem({ ...item, count: q.target.value })}
                      />
                    }
                  </div>
                  <div className={styles.block}>
                    <p className={styles.label}>Бюджет</p>
                    {(item?.status === 'suggested' || item?.status === 'done' || item?.status === 'rejected') ?
                      <p className={styles.value}>{item?.cost} тг</p>
                      :
                      <TextInput
                        value={item?.cost ?? ''}
                        name='cost'
                        onChange={(q) => setItem({ ...item, cost: q.target.value })}
                      />
                    }
                  </div>

                  <div className={styles.block}>
                    <p className={styles.label}>Описание</p>
                    {(item?.status === 'suggested' || item?.status === 'done' || item?.status === 'rejected') ?
                      <p className={styles.value}>{item?.description}</p>
                      :
                      <Textarea
                        value={item?.description ?? ''}
                        name='description'
                        onChange={(q) => setItem({ ...item, description: q.target.value })}
                        classNames={{
                          input: 'h-44'
                        }}
                      />
                    }
                  </div>
                    <div className={styles.block}>
                      <p className={styles.label}>Срок исполнения</p>
                      {(item?.status === 'suggested' || item?.status === 'done' || item?.status === 'rejected') ?
                        <p className={styles.value}>{item?.duration}</p>
                        :
                        <NumberInput
                          value={item?.duration ?? ''}
                          name='duration'
                          onChange={(q) => setItem({ ...item, duration: q })}
                          rightSection='дней'
                          classNames={{
                            rightSection: 'mr-4'
                          }}
                        />
                      }
                    </div> */}
                    {item?.status === 'suggested' && (
                      <>
                        {item?.urls?.map((e, i) => {
                          return (
                            <div className={styles.block} key={i}>
                              <p className={styles.label}>Стоимость - {i + 1}</p>
                              <p className={styles.value}>{e.cost} тг</p>
                              {e?.specs && (
                                <img src={e?.specs} alt="" className='w-24' onClick={() => handleImageView(e.specs)} />
                              )}
                              {e?.good && (
                                <img src={e?.good} alt="" className='w-24' onClick={() => handleImageView(e.good)} />
                              )}
                              {e?.extra && (
                                <img src={e?.extra} alt="" className='w-24' onClick={() => handleImageView(e.extra)} />
                              )}
                            </div>
                          )
                        })}
                        <div className={styles.block}>
                          <p className={styles.label}>Полученная сумма</p>
                          <NumberInput
                            value={item?.our_cost ?? ''}
                            onChange={(q) => setItem({ ...item, our_cost: q })}
                          />
                        </div>
                      </>
                    )}
                    {item?.status === 'done' && (
                        <Button
                          color={'green'}
                          px={30}
                          onClick={() => confirmModal('Вы действительно хотите завершить заявку?', 'ended', 'Подтвердить', endItem)}
                        >
                          Завершить
                        </Button>
                    )}
                    {/* <div>
                      <Button onClick={saveItem}>
                        Сохранить
                      </Button>
                    </div> */}
                    <div className='space-x-4'>
                      {item?.status === 'waiting' && (
                        <Button
                          color={'green'}
                          px={30}
                          onClick={() => confirmModal('Вы действительно хотите принять заявку?', 'adopted', 'Подтвердить', adoptItem)}
                        >
                          Принять
                        </Button>
                      )}
                      {item?.status === 'suggested' && (
                        <Button
                          color={'green'}
                          px={30}
                          onClick={() => confirmModal('Вы действительно хотите заключить заявку?', 'done', 'Подтвердить', concludeItem)}
                          disabled={again || !item?.our_cost}
                        >
                          Заключить
                        </Button>
                      )}
                      {item?.status === 'raw' && (
                        <>
                          <Button
                            color={'green'}
                            px={30}
                            disabled={!item?.duration}
                            onClick={() => confirmModal('Вы действительно хотите принять заявку?', 'adopted', 'Подтвердить', adoptItem)}
                          >
                            Принять
                          </Button>
                          <Button
                            color={'green'}
                            px={30}
                            onClick={() => confirmModal('Вы действительно хотите принять заявку?', 'suggested', 'Подтвердить', sameItem)}
                          >
                            Похожий заказ
                          </Button>
                        </>
                      )}
                      {(admin && (item?.status === 'rejected')) && (
                        <Button 
                          color={'green'} 
                          variant={'outline'} 
                          px={30} onClick={() => confirmModal('Вы действительно хотите восстановить заявку?', 'raw', 'Восстановить', restoreItem)}
                        >
                          Восстановить
                        </Button>
                      )}
                      {((item?.status === 'raw') || (item?.status === 'adopted') || (item?.status === 'suggested') || (item?.status === 'waiting')) && (
                        <Button 
                          color={'red'} 
                          variant={'outline'} 
                          px={30} onClick={() => rejectModal('Вы действительно хотите принять заявку?', 'rejected', 'Отклонить')}
                        >
                          Отклонить
                        </Button>
                      )}
                        
                      {item?.status === 'suggested' && (
                        <Button
                          color={'yellow'}
                          px={30}
                          onClick={() => setAgain(true)}
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
                            px={30}
                            onClick={() => confirmModal('Вы действительно хотите переподать заявку?', 'adopted', 'Переподать', reAdoptItem)}
                          >
                            Переподача
                          </Button>
                          <Button
                            color={'yellow'}
                            px={30}
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
      <Modal
        opened={modal.value}
        onClose={() => setModal({...modal, value: false})}
        centered
        withCloseButton={false}
      >
        <img src={modal?.src} alt="" />
      </Modal>
    </>
  )
}

export default ItemView