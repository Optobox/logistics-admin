import React from 'react'
import { TextInput, PasswordInput, Button } from '@mantine/core'
import axios from 'axios'
import { merged } from '../../utlis/validation'
import { showNotification } from '@mantine/notifications'


function CreateManager() {

  const [visor, setVisor] = React.useState({
    email: '',
    phoneNumber: '',
    password: '',
    password_confirmation: '',
    name: '',
  })

  const [errors, setErrors] = React.useState({
    email: [],
    phoneNumber: [],
    password: [],
    password_confirmation: [],
    name: [],
    other: []
  })

  const [loading, setLoading] = React.useState(false)

  const yupErrorToErrorObject = (err) => {
    const object = {};
    err.inner.forEach((x) => {
      if (x.path !== undefined) {
        object[x.path] = x.errors;
      }
    });
    return setErrors(object);
  }

  const validate = async (e) => {
    e.preventDefault()
    await merged.validate({
      name: visor.name,
      email: visor.email, 
      password: visor.password,
      password_confirmation: visor.password_confirmation,
    }, {abortEarly: false})
    .then(e => {
      createUser()
    })
    .catch(e => {
      yupErrorToErrorObject(e)
    })
  }

  const createUser = async e => {
    setLoading(true)
    await axios.post('/api/users', {
      email: visor.email,
      password: visor.password, 
      displayName: visor.name,
      phoneNumber: visor.phoneNumber
    })
    .then(e => {
      showNotification({title: 'Менеджер', message: 'Менеджер успешно создан', color: 'green'})
      setVisor({})
      setErrors({})
    })
    .catch(err => {
      setErrors({...errors, other: [err.response?.data?.message] });
    })
    .finally(() => {
      setLoading(false)
    })
  }

  const handleInput = e => {
    const {name, value} = e.target
    setVisor({...visor, [name]: value})
    setErrors({...errors, [name]: []})
  }

  return (
    <div>
      <h2 className='mb-4 text-xl'>Создание менеджера</h2>
      <form className='max-w-xs space-y-4' onSubmit={validate}>
        <TextInput
          label='Имя Фамилия'
          name='name'
          value={visor.name ?? ''}
          onChange={handleInput}
          error={errors?.name?.[0]}
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
          error={errors?.email?.[0]}
        />
        <PasswordInput
          label='Пароль'
          name='password'
          value={visor.password ?? ''}
          onChange={handleInput}
          error={errors?.password?.[0]}
          visible
        />
        <PasswordInput
          label='Подтверждение пароля'
          name='password_confirmation'
          value={visor.password_confirmation ?? ''}
          onChange={handleInput}
          error={errors?.password_confirmation?.[0]}
          visible
        />

        {errors.other?.[0] && (
          <p className='text-pink-500 text-sm'>{errors.other?.[0]}</p>
        )}
        <Button 
          type='submit'
          loading={loading}
        >
          Создать
        </Button>
      </form>
    </div>
  )
}

export default CreateManager