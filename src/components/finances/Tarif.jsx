import React from 'react'
import { TextInput, Button, NumberInput } from '@mantine/core'
import { db } from '../../utlis/firebase'
import { doc } from 'firebase/firestore'
import { PermissionContext } from '../../layout/Layout'

// const regex = (/^(([0-9.]?)*)+$/)

function Tarif() {

  const {tarif} = React.useContext(PermissionContext)

  const [tax, setTax] = React.useState({})

  const handleInput = (e) => {
    const {name, value} = e.target
    setTax({...tax, [name]: parseInt(value) ? parseInt(value) : value})
  }

  const saveTarif = async () => {
    await updateDoc(doc(db, 'tarif', 'tarif'), {
      ...tax
    })
    .then(() => {
      alert('Тариф успешно изменен')
    })
  }

  React.useEffect(() => {
    if (tarif) {
      setTax(tarif)
    }
  }, [tarif])

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-4 max-w-xs'>
        <TextInput
          name='deliver_cost'
          value={tax.deliver_cost ?? ''}
          onChange={handleInput}
          label='Доставка'
        />
        <TextInput
          name='manager'
          value={tax.manager ?? ''}
          onChange={handleInput}
          label='Глав. менеджер'
        />
        <TextInput
          name='purchase_manager'
          value={tax.purchase_manager ?? ''}
          onChange={handleInput}
          label='Закуп. менеджер'
        />
        <TextInput
          name='our_cost'
          value={tax?.our_cost ?? ''}
          onChange={handleInput}
          label='Наша доля'
        />
        <TextInput
          name='service_manager'
          value={tax.service_manager ?? ''}
          onChange={handleInput}
          label='Сервис менеджер'
        />
        <TextInput
          name='our_kg'
          value={tax.our_kg ?? ''}
          onChange={handleInput}
          label='Наша доля кг'
        />
        <TextInput
          name='our_cube'
          value={tax.our_cube ?? ''}
          onChange={handleInput}
          label='Наша доля куб'
        />
        <TextInput
          name='logist_manager'
          value={tax.logist_manager ?? ''}
          onChange={handleInput}
          label='Логист менеджер'
        />
      </div>
      <Button 
        onClick={saveTarif}
      >
        Сохранить
      </Button>
    </div>
  )
}

export default Tarif