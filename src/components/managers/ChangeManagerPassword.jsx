import React from 'react'
import { TextInput, Button } from '@mantine/core'

function ChangeManagerPassword() {
  return (
    <div>
      <h2 className='mb-4 text-xl'>Смена пароля менеджера</h2>
      <div className='space-y-4'>
        <TextInput
          label='Почта менеджера'
        />
        <p>Письмо будет отправлено на почту Optobox@mail.ru</p>
        <Button>
          Отправить
        </Button>
      </div>
    </div>
  )
}

export default ChangeManagerPassword