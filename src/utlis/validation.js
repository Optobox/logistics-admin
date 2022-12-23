import * as yup from 'yup'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const loginSchema = yup.object({
  email: yup.string().email("Неверный формат почты").required("Почта обязательна для заполнения"),
  password: yup.string().min(8, "Минимум 8 символов").max(14, "Максимум 14 символов").required("Пароль обязателен для заполнения"),
})

const optionalSchema = yup.object().shape({
  name: yup.string().min(2, "Слишком мало символов").required("Имя обязательно для заполнения"),
  password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Пароли не совпадают')
})

const merged = loginSchema.concat(optionalSchema)

const deliverySchema = yup.object().shape({
  trackID: yup.string().min(6, "Минимум 6 символов").required("Заполните данное поле"),
  type: yup.string().required("Заполните данное поле"),
  comment: yup.string().required("Заполните данное поле")
})

const consultSchema = yup.object().shape({
  name: yup.string().required("Заполните данное поле"),
  question: yup.string().min(5, "Опишите подробнее ваш вопрос").required("Заполните данное поле"),
  tel: yup.string().matches(phoneRegExp, "Неверный формат номера").required("Заполните данное поле"),
  email: yup.string().email("Неверный формат почты").required("Заполните данное поле"),
})

const trackValueSchema = yup.object().shape({
  insurance: yup
    .number()
    .typeError('Введите число')
    .nullable()
    .moreThan(0, "Число не может быть отричательным")
    .transform((_, val) => (val !== "" ? Number(val) : null)),
  boxes: yup.number().typeError('Введите число').required("Заполните данное поле").moreThan(0, "Число не может быть отричательным"),
  cube: yup
    .number()
    .typeError('Введите число')
    .nullable()
    .moreThan(0, "Число не может быть отричательным")
    .transform((_, val) => (val !== "" ? Number(val) : null)),
  cube_cost:  yup
    .number()
    .typeError('Введите число')
    .nullable()
    .moreThan(0, "Число не может быть отричательным")
    .transform((_, val) => (val !== "" ? Number(val) : null)),
  weight: yup
    .number()
    .typeError('Введите число')
    .nullable()
    .moreThan(0, "Число не может быть отричательным")
    .transform((_, val) => (val !== "" ? Number(val) : null)),
  weight_cost:   yup
    .number()
    .typeError('Введите число')
    .nullable()
    .moreThan(0, "Число не может быть отричательным")
    .transform((_, val) => (val !== "" ? Number(val) : null)),
  total_cost: yup
    .number()
    .typeError('Введите число')
    .required("Заполните данное поле")
    .moreThan(0, "Число не может быть отричательным"),
  pack_cost: yup
  .number()
  .typeError('Введите число')
  .nullable()
  .moreThan(0, "Число не может быть отричательным")
  .transform((_, val) => (val !== "" ? Number(val) : null)),
  pack: yup.array().required("Заполните данное поле"),
  note_id: yup.string().required('Заполните данное поле'),
  carcas: yup
    .number()
    .typeError('Введите число')
    .nullable()
    .moreThan(0, "Число не может быть отричательным")
    .transform((_, val) => (val !== "" ? Number(val) : null))
})

export {
  merged,
  loginSchema,
  deliverySchema,
  trackValueSchema,
  consultSchema,
}