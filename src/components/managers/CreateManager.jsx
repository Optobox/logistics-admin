import React from 'react'
import { TextInput, Select, PasswordInput, Button } from '@mantine/core'


function CreateManager() {

  const [value, setValue] = React.useState({
    email: '',
    phoneNumber: '',
    password: '',
    password_confirmation: '',
    displayName: '',
    photoURL: '',
    disabled: false
  })


  const createUser = async () => {

  }


  return (
    <div>
      <h2 className='mb-4 text-xl'>Создание менеджера</h2>
      <form className='max-w-xs space-y-4' onSubmit={createUser}>
        <TextInput
          label='Имя Фамилия'
          name='displayName'
          value={value.displayName ?? ''}
          onChange={e => setValue({...value, displayName: e.target.value})}
        />
        <TextInput
          label='Телефон'
          name='phoneNumber'
          value={value.displayName ?? ''}
          onChange={e => setValue({...value, phoneNumber: e.target.value})}
        />
        <Select
          data={[]}
          label='Роль'
        />
        <TextInput
          label='Почта'
          name='email'
          value={value.email ?? ''}
          onChange={e => setValue({...value, email: e.target.value})}
        />
        <PasswordInput
          label='Пароль'
          name='password'
          value={value.password ?? ''}
          onChange={e => setValue({...value, password: e.target.value})}
          visible
        />
        <PasswordInput
          label='Подтверждение пароля'
          name='password_confirmation'
          value={value.password_confirmation ?? ''}
          onChange={e => setValue({...value, password_confirmation: e.target.value})}
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