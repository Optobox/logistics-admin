import React from 'react'
import { Button, Checkbox, TextInput } from '@mantine/core'
import { trackValueSchema } from '../../utlis/validation'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../utlis/firebase'
import { openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { PermissionContext } from '../../layout/Layout'

function DeliveryNote({item, setItem}) {

  const {tarif} = React.useContext(PermissionContext)

  const [errors, setErrors] = React.useState({
    note_id: [],
    insurance: [],
    boxes: [],
    cube: [],
    weight: [],
    weight_cost: [],
    total_cost: [],
    pack: [],
    pack_cost: [],
    carcas: [],
  })

  const yupErrorToErrorObject = (err) => {
    const object = {};
    err.inner.forEach((x) => {
      if (x.path !== undefined) {
        object[x.path] = x.errors;
      }
    });
    return setErrors(object);
  }
  
  const [pack, setPack] = React.useState([])

  React.useEffect(() => {
    if (item?.pack) {
      setPack(item?.pack)
    } else {
      setPack([])
    }
  }, [item])

  const handlePack = e => {
    setPack(e)
    setItem({...item, pack: e})
  }

  const trackOrder = async () => {
    await updateDoc(doc(db, 'track', item?.id), {
      ...item,
      pack: pack,
      isTracking: true,
      step: 1,
      updatedAt: serverTimestamp(),
      our_cost: tarif?.our_cost,
      our_kg: tarif?.our_kg,
      our_cube: tarif?.our_cube,
    })
    .then(e => {
      showNotification({ title: 'Накладная', message: `Накладная успешно добавлена, теперь вы можете начать отслеживать доставку`, color: 'green' })
    })
    .catch(e => {
      showNotification({ title: 'Накладная', message: 'Не удалось добавить накладную', color: 'red' })
    })
  }

  const checkNote = () => {
    trackValueSchema.validate(item, { abortEarly: false })
    .then(() => {
      confirmOrder()
    })
    .catch(err => {
      yupErrorToErrorObject(err)
    })
  }

  const confirmOrder = () => openConfirmModal({
    centered: true, 
    title: 'Подтверждение действия',
    children: (
      <p>Вы действительно хотите начать отслеживать доставку?</p>
    ),
    labels: {confirm: 'Отслеживать', cancel: 'Отмена'},
    onConfirm: () => trackOrder()
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

  const disabledButton = !item?.deliveries?.every(e => {
    return e.status === 'confirmed' || e.status === 'canceled'
  })

  return (
    <form className='flex flex-col gap-y-2 px-4'>
      <TextInput
        name='note_id'
        value={item?.note_id ?? ''}
        onChange={handleInputChange}
        label="Накладная-ID"
        error={errors?.note_id?.[0]}
        readOnly={item?.isTracking}
      />
      <TextInput
        label='Страховка'
        value={item?.insurance ?? ''}
        name='insurance'
        onChange={handleInputChange}
        readOnly={item?.isTracking}
      />
      <TextInput
        name='boxes'
        value={item?.boxes ?? ''}
        onChange={handleInputChange}
        label="Количество коробок"
        error={errors?.boxes?.[0]}
        readOnly={item?.isTracking}
      />
      <TextInput
        name='cube'
        value={item?.cube ?? ''}
        onChange={handleInputChange}
        label="Куб"
        error={errors?.cube?.[0]}
        readOnly={item?.isTracking}
      />
      <TextInput
        name='cube_cost'
        value={item?.cube_cost ?? ''}
        onChange={handleInputChange}
        label="Стоимость за куб"
        error={errors?.cube_cost?.[0]}
        readOnly={item?.isTracking}
      />
      <TextInput
        name='weight'
        value={item?.weight ?? ''}
        onChange={handleInputChange}
        label="Вес"
        error={errors?.weight?.[0]}
        readOnly={item?.isTracking}
      />
      <TextInput
        name='weight_cost'
        value={item?.weight_cost ?? ''}
        onChange={handleInputChange}
        label="Стоимость за кг"
        error={errors?.weight_cost?.[0]}
        readOnly={item?.isTracking}
      />
      <TextInput
        name='total_cost'
        value={item?.total_cost ?? ''}
        onChange={handleInputChange}
        label="Общая стоимость"
        error={errors?.total_cost?.[0]}
        readOnly={item?.isTracking}
      />
      <TextInput
        name='pack_cost'
        value={item?.pack_cost ?? ''}
        onChange={handleInputChange}
        label="Сборка товара"
        error={errors?.pack_cost?.[0]}
        readOnly={item?.isTracking}
      />
      <Checkbox.Group
        label='Упаковка'
        name='pack'
        onChange={handlePack}
        value={pack}
        readOnly={item?.isTracking}
      >
        <Checkbox checked={pack?.includes('carton')} value='carton' label='Картон' classNames={{label: 'dark:text-gray-100'}} />
        <Checkbox checked={pack?.includes('bag')} value='bag' label='Мешок' classNames={{label: 'dark:text-gray-100'}} />
      </Checkbox.Group>
      <TextInput
        name='carcas'
        value={item?.carcas ?? ''}
        onChange={handleInputChange}
        label="Карказ-обрешетка"
        error={errors?.carcas?.[0]}
        readOnly={item?.isTracking}
      />
      {!item?.isTracking && 
        <Button 
          className='lg:w-96 mx-auto' 
          onClick={checkNote}
          mt={20}
          disabled={disabledButton}
        >
          Отправить
        </Button>
      }
    </form>
  )
}

export default DeliveryNote