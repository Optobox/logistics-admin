import dayjs from 'dayjs'

export const timestamp = Math.floor(new Date().getTime() / 1000)

export const checkTime = () => {
  const month = dayjs(new Date()).format('MMMM')
  const year = dayjs(new Date()).format('YY')

  return `${month}-${year}`
}