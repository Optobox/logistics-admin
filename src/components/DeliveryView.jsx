import React from 'react'
import { Button, Checkbox, Menu, Radio, Table, TextInput } from '@mantine/core'
import dayjs from 'dayjs'

import cn from 'classnames'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { showNotification } from '@mantine/notifications'
import { useClipboard } from '@mantine/hooks'
import { auth, db } from '../utlis/firebase'

import { trackValueSchema } from '../utlis/validation'
import { useAuthState } from 'react-firebase-hooks/auth'


function DeliveryView({values = []}) {

  const [user] = useAuthState(auth)

  const [item, setItem] = React.useState({})
  const [selected, setSelected] = React.useState(null)
  const [pack, setPack] = React.useState([])

  React.useEffect(() => {
    setItem(values?.find(e => e.id === item?.id))
  }, [values])

  React.useEffect(() => {
    if (item?.pack) {
      setPack(item?.pack)
    } else {
      setPack([])
    }
  }, [item])

  const handleSelected = (id, item, i) => {
    setSelected(id)
    setItem(item)
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

  const [errors, setErrors] = React.useState({
    note_id: [],
    insurance: [],
    boxes: [],
    cube: [],
    weight: [],
    weight_cost: [],
    total_cost: [],
    carcas: [],
  })

  const handleInputChange = (e, name, value) => {
    if (e?.target) {
      const { name, value } = e.target
      // if (parseInt(value)) return 
      setItem({ ...item, [name]: value })
      setErrors({ ...errors, [name]: [] })
      return
    }

    if (name === 'pack') {
      setItem({...item, pack: [value]})
      setErrors({ ...errors, [name]: [] })
      return
    }

    setItem({ ...item, [name]: value })
    setErrors({ ...errors, [name]: [] })
  }

  const yupErrorToErrorObject = (err) => {
    const object = {};
    err.inner.forEach((x) => {
      if (x.path !== undefined) {
        object[x.path] = x.errors;
      }
    });
    return setErrors(object);
  }

  const trackOrder = async (e) => {
    e.preventDefault()
    trackValueSchema.validate(item, { abortEarly: false })
      .then(async () => {
        console.log('asdads');
        await updateDoc(doc(db, 'track', item?.id), {
          ...item,
          pack: pack,
          isTracking: true,
          step: 1,
          updatedAt: serverTimestamp(),
        })
          .then(e => {
            showNotification({ title: 'Накладная', message: `Накладная успешно добавлена, теперь вы можете начать отслеживать доставку`, color: 'green' })
          })
          .catch(e => {
            showNotification({ title: 'Накладная', message: 'Не удалось добавить накладную', color: 'red' })
          })
      })
      .catch(err => {
        yupErrorToErrorObject(err)

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

  const saveWeight = async () => {
    await updateDoc(doc(db, 'track', item.id), {
      updatedAt: serverTimestamp(),
      pack: pack,
      ...item
    })
      .then(e => {
        showNotification({ title: 'Вес', message: `Вес посылок успешно изменен`, color: 'green' })
      })
      .catch(e => {
        showNotification({ title: 'Вес', message: 'Не удалось изменить вес посылок', color: 'red' })
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

  const [step, setStep] = React.useState(1)

  React.useEffect(() => {
    if (item?.isTracking) {
      setStep(item?.step)
    } 
  }, [item])

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

  const changeStep = async (e) => {
    e.preventDefault()
    await updateDoc(doc(db, 'track', item?.id), {
      ...item, 
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

  const takeTrack = async () => {
    await updateDoc(doc(db, 'track', item?.id), {
      logist_manager: {
        uid: user?.uid,
        email: user?.email,
        displayName: user?.displayName
      }
    })
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-[55%_auto]'>
      <Table className='h-min'>
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
          {values?.map((item, i) => {

            const createdAt = dayjs(item?.createdAt?.seconds * 1000).format('DD.MM.YYYY, HH:mm')
            const process = item?.deliveries?.find(q => q.status === 'confirmed')
            const pending = item?.deliveries?.every(q => q.status === 'pending')
            const building = item?.deliveries?.every(q => (q.status === 'confirmed') || (q.status === 'canceled'))
            const failed = item?.deliveries?.find(q => q.status === 'failed')

            return (
              <tr 
                key={i} 
                onClick={() => handleSelected(item?.id, item, i)}
                className={cn('transition-all duration-200', {
                  'bg-slate-200': selected == item?.id
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
      {item?.id && (
        <div className='space-y-4'>
          <Table className='border'>
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
                            // onClick={() => handleEdit(e, i)}
                            size='xs'
                            compact
                            variant='subtle'
                          >
                            {e.status === 'pending' && 'В обработке'}
                            {e.status === 'confirmed' && 'На складе'}
                            {e.status === 'waiting' && 'В ожидании'}
                            {e.status === 'failed' && 'Не найден'}
                            {e.status === 'canceled' && 'Отменен'}
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
          <form className='flex flex-col gap-y-2 px-4' onSubmit={trackOrder}>
            <TextInput
              name='note_id'
              value={item?.note_id ?? ''}
              onChange={handleInputChange}
              label="Накладная-ID"
              error={errors?.note_id?.[0]}
            />
            <TextInput
              label='Страховка'
              value={item?.insurance ?? ''}
              name='insurance'
              onChange={handleInputChange}
            />
            <TextInput
              name='boxes'
              value={item?.boxes ?? ''}
              onChange={handleInputChange}
              label="Количество коробок"
              error={errors?.boxes?.[0]}
            />
            <TextInput
              name='cube'
              value={item?.cube ?? ''}
              onChange={handleInputChange}
              label="Куб"
              error={errors?.cube?.[0]}
            />
            <TextInput
              name='weight'
              value={item?.weight ?? ''}
              onChange={handleInputChange}
              label="Вес"
              error={errors?.weight?.[0]}
            />
            <TextInput
              name='weight_cost'
              value={item?.weight_cost ?? 5}
              onChange={handleInputChange}
              label="Стоимость за кг"
              error={errors?.weight_cost?.[0]}
            />
            <TextInput
              name='total_cost'
              value={item?.total_cost ?? 5}
              onChange={handleInputChange}
              label="Общая стоимость"
              error={errors?.total_cost?.[0]}
            />
            <Checkbox.Group
              label='Упаковка'
              name='pack'
              onChange={e => setPack(e)}
              value={pack}
            >
              <Checkbox checked={pack?.includes('carton')} value='carton' label='Картон' />
              <Checkbox checked={pack?.includes('bag')} value='bag' label='Мешок' />
            </Checkbox.Group>
            <TextInput
              name='carcas'
              value={item?.carcas ?? ''}
              onChange={handleInputChange}
              label="Карказ-обрешетка"
              error={errors?.carcas?.[0]}
            />
            {!item?.isTracking && 
              <Button className='lg:w-96 mx-auto' type='submit' mt={20}>
                Отправить 
              </Button>
            }
            {item?.isTracking && (
              <>
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
                  {steps.map((e) => {
                    return (
                      <div>
                        <div>{e.id}</div>
                        <h2>{e.title}</h2>
                        <p>{e.description}</p>
                      </div>
                    )
                  })?.[step - 1]}
                </div>
                <Button type='button' onClick={changeStep}>
                  Сохранить
                </Button>
              </>
            )}
            <Button>
              Принять
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

export default DeliveryView