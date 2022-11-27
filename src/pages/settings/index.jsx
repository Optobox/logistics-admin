import { Button, TextInput } from '@mantine/core'
import { doc, updateDoc } from 'firebase/firestore'
import React from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { db } from '../../utlis/firebase'

const regex = /^[\.0-9]*$/

function Settings() {

  const [value, loading] = useDocumentData(doc(db, 'tarif', 'tarif'))

  const [tarif, setTarif] = React.useState({})

  const handleInput = (e) => {
    const {name, value} = e.target
    if (regex.test(value)) {
      setTarif({...tarif, [name]: value})
    }
  }

  const saveTarif = async () => {
    await updateDoc(doc(db, 'tarif', 'tarif'), {
      ...tarif
    })
    .then(() => {
      alert('Тариф успешно изменен')
    })
    .catch(() => {

    })
  }

  React.useEffect(() => {
    if (value) setTarif(value)
  }, [value, loading])

  if (loading) return <></>

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-4 max-w-xs'>
        <TextInput
          name='deliver_cost'
          value={tarif.deliver_cost ?? ''}
          onChange={handleInput}
          label='Доставка'
        />
        <TextInput
          name='manager'
          value={tarif.manager ?? ''}
          onChange={handleInput}
          label='Глав. менеджер'
        />
        <TextInput
          name='purchase_manager'
          value={tarif.purchase_manager ?? ''}
          onChange={handleInput}
          label='Закуп. менеджер'
        />
        <TextInput
          name='our_cost'
          value={tarif.our_cost ?? ''}
          onChange={handleInput}
          label='Наша доля'
        />
        <TextInput
          name='service_manager'
          value={tarif.service_manager ?? ''}
          onChange={handleInput}
          label='Сервис менеджер'
        />
        <TextInput
          name='logist_manager'
          value={tarif.logist_manager ?? ''}
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

export default Settings