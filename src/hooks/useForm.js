import React from 'react'
import { auth, db } from "../utlis/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, sendEmailVerification, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { loginSchema, merged } from "../utlis/validation"
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'

export default function useForm() {

  const router = useRouter()

  const [values, setValues] = React.useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    stay: false
  })

  const [errors, setErrors] = React.useState({
    name: [],
    email: [],
    password: [],
    password_confirmation: [],
    other: []
  })

  const [loading, setLoading] = React.useState(false)

  const handleInputChange = e => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
    setErrors({ ...errors, [name]: [], other: [] })
  }

  const handleCheckboxChange = e => {
    if (!values.stay) return setValues({ ...values, stay: true })
    setValues({ ...values, stay: false })
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

  const handleSubmit = {
    register: (event) => {
      event.preventDefault();
      setLoading(true)
      merged.validate(values, { abortEarly: false })
        .then(e => {
          createUserWithEmailAndPassword(auth, values.email, values.password)
            .then(async e => {
              await sendEmailVerification(e.user)
                .then(() => {
                  showNotification({ title: 'Регистрация', message: `Письмо с подтверждением было отправлено на почту ${e.user.email}`, color: 'green' })
                })
                .catch(() => {
                  showNotification({ title: 'Регистрация', message: `Не удалось отправить письмо с подтверждением на почту ${e.user.email}`, color: 'red' })
                })
              await updateProfile(e.user, {
                displayName: values.name,
              })
              setLoading(false)
              setTimeout(e => {
                router.push('/')
              }, 1000)
            })
            .catch(e => {
              switch (e.code) {
                case 'auth/too-many-requests':
                  setErrors({ ...errors, other: ['Сликом много попыток попробуйте чуть позже'] })
                  break
                case 'auth/email-already-in-use':
                  setErrors({ ...errors, other: ['Почта уже используется'] })
                  break
                default:
              }
              setLoading(false)
            })
        })
        .catch(e => {
          yupErrorToErrorObject(e)
          setLoading(false)
        })
      return
    },
    login: async (event) => {
      event.preventDefault();
      setLoading(true)
      loginSchema.validate({ email: values.email, password: values.password }, { abortEarly: false })
        .then(e => {
          signInWithEmailAndPassword(auth, values.email, values.password)
            .then(e => {
              if (values.stay) localStorage.setItem('logged_in', true)
              showNotification({ title: 'Авторизация', message: `Вы вошли как ${e.user.displayName}`, color: 'green' })
              Cookies.set('user', e.user.uid, { expires: 7 })
              setLoading(false)
              router.push('/')
            })
            .catch(e => {
              switch (e.code) {
                case 'auth/too-many-requests':
                  setErrors({ ...errors, other: ['Слишком много попыток попробуйте чуть позже'] })
                  break
                case 'auth/user-not-found':
                  setErrors({ ...errors, other: ['Неверная почта или пароль'] })
                  break
                case 'auth/wrong-password':
                  setErrors({ ...errors, other: ['Неверная почта или пароль'] })
                  break
                default:
              }
              setLoading(false)
            })
        })
        .catch(e => {
          yupErrorToErrorObject(e)
          setLoading(false)
        })
    },
    loginWithGoogle: async (event) => {
      event.preventDefault();
      signInWithPopup(auth, new GoogleAuthProvider())
        .then(async e => {
          showNotification({ title: 'Авторизация', message: `Вы вошли как ${e.user.displayName}`, color: 'green' })
          router.push('/')
        })
        .catch(e => {
          console.log(e, "err");
          showNotification({ title: 'Авторизация', message: `Не удалось войти через Google`, color: 'red' })
        })
    },
    resetPassword: (event) => {
      event.preventDefault();
      setLoading(true)
      loginSchema.validate({ email: values.email, password: '123123123' }, { abortEarly: false })
        .then(async () => {
          await sendPasswordResetEmail(auth, values.email)
            .then((e) => {
              showNotification({ title: 'Восстановление', message: `Письмо с востанновление пароля было отправлено на почту ${values.email}`, color: 'green' })
            })
            .catch(err => {
              if (err.code === 'auth/user-not-found') {
                setErrors({ ...errors, other: ['Неверная почта'] })
                return
              }
            })
        })
        .catch(err => {
          yupErrorToErrorObject(err)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    singout: (event) => {
      event.preventDefault();
      Cookies.remove('avatar')
      Cookies.remove('markup')
      Cookies.remove('user')
      signOut(auth)
        .then(e => {
          console.log("signout");
          router.psuh(0)
        })
    }
  }

  return {
    values,
    handleInputChange,
    handleSubmit,
    handleCheckboxChange,
    errors,
    loading,
    setErrors,
  }
}