import React from 'react'
import { TextInput, Select, PasswordInput, Button } from '@mantine/core'
import axios from 'axios'
import { addDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../utlis/firebase'
import { randomId } from '@mantine/hooks'


function CreateManager() {

  const [visor, setVisor] = React.useState({
    email: '',
    phoneNumber: '',
    password: '',
    password_confirmation: '',
    displayName: '',
  })

  const createUser = async (e) => {
    e.preventDefault()
    await axios.post('/api/users', {
      email: visor.email,
      password: visor.password, 
      displayName: visor.displayName
    })
    .then(e => {
      console.log(e);
    })
    .catch(err => {

    })
  }

  const createUserStore = async () => {
    await addDoc(doc(db, 'users'), {
      
    })
  }

  const handleInput = e => {
    const {name, value} = e.target
    setVisor({...visor, [name]: value})
  }


  return (
    <div>
      <h2 className='mb-4 text-xl'>Создание менеджера</h2>
      <form className='max-w-xs space-y-4' onSubmit={createUser}>
        <TextInput
          label='Имя Фамилия'
          name='displayName'
          value={visor.displayName ?? ''}
          onChange={handleInput}
        />
        <TextInput
          label='Телефон'
          name='phoneNumber'
          value={visor.phoneNumber ?? ''}
          onChange={handleInput}
        />
        <TextInput
          label='Почта'
          name='email'
          value={visor.email ?? ''}
          onChange={handleInput}
        />
        <PasswordInput
          label='Пароль'
          name='password'
          value={visor.password ?? ''}
          onChange={handleInput}
          visible
        />
        <PasswordInput
          label='Подтверждение пароля'
          name='password_confirmation'
          value={visor.password_confirmation ?? ''}
          onChange={handleInput}
          visible
        />
        <Button type='submit'>
          Создать
        </Button>
      </form>
    </div>
  )
}

export default CreateManager