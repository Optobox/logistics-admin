import { Button, PasswordInput, TextInput } from '@mantine/core'
import React from 'react'
import useForm from '../hooks/useForm'

const styles = {
  inputError: 'mb-2'
}


function Login() {

  const { values, handleSubmit, errors, handleInputChange, loading } = useForm()

  return (
    <form className="mt-4 space-y-4 max-w-md mx-auto">
      <div className="flex flex-col gap-y-2">
        <div>
          <TextInput
            label="Почта"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Почта"
            value={values.email}
            onChange={handleInputChange}
            error={errors.email?.[0]}
            classNames={{
              error: styles.inputError
            }}
          >
          </TextInput>
        </div>
        <div>
          <PasswordInput
            label="Пароль"
            name="password"
            autoComplete="current-password"
            required
            placeholder="Пароль"
            value={values.password}
            onChange={handleInputChange}
            error={errors.password?.[0]}
            classNames={{
              error: styles.inputError,
            }}
          />
        </div>
        <div>
          {errors.other?.[0] && (
            <p className='text-xs text-red-500'>{errors.other?.[0]}</p>
          )}
        </div>
      </div>
      <p className='underline text-blue-400 cursor-pointer' onClick={() => setResetPassword(true)}>Забыли пароль?</p>
      <div>
        <Button
          onClick={e => handleSubmit.login(e)}
          fullWidth
          loading={loading}
        >
          Войти
        </Button>
      </div>
    </form>
  )
}

export default Login