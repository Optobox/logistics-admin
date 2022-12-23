import React from 'react'
import { TextInput, Button } from '@mantine/core'
import axios from 'axios'

const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

function ChangeManagerPassword() {

  const [email, setEmail] = React.useState('')
  const [error, setError] = React.useState('')
  const [link, setLink] = React.useState('')

  const handleInput = e => {
    const {value} = e.target
    setEmail(value)
    setError(null)
  }

  const send = async e => {
    if (!email.match(regex)) {
      setError('Неверный формат почты')
      return
    }
    await axios.post('/api/users/change', {
      email: email
    })
    .then(e => {
      if (e.data.code) {
        setError('Почта не найдена')
        return
      }
      setLink(e.data)
    })
    .catch(err => {
      switch(err.data.code) {
        case 'auth/email-not-found' :
          setError('Почта не найдена')
          break
      }
    })
  }

  return (
    <div>
      <h2 className='mb-4 text-xl'>Смена пароля менеджера</h2>
      <div className='space-y-4'>
        <TextInput
          label='Почта менеджера'
          value={email}
          onChange={handleInput}
          type='email'
          className='max-w-md'
          error={error}
        />
        {link && (
          <div>
            <p>
              <a href={link} target='_blank'>{link}</a>
            </p>
            <Button
              compact
              variant='subtle'
              onClick={e => setLink(null)}
            >
              Очистить
            </Button>
          </div>
        )}

        <Button 
          onClick={send}
          disabled={!email || link || error}
        >
          Отправить
        </Button>
      </div>
    </div>
  )
}

export default ChangeManagerPassword