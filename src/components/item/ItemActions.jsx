import { Button, NumberInput, Textarea, TextInput, Collapse } from '@mantine/core'
import { useRouter } from 'next/router'
import React from 'react'
import { PermissionContext } from '../../layout/Layout'
import { styles } from './ItemView'

function ItemActions({
  item, 
  confirmModal, 
  rejectModal, 
  setAgain, 
  saveItem,
  again,
  newItem, 
  setNewItem,
}) {

  const { manager, service, admin, purchase } = React.useContext(PermissionContext)

  const router = useRouter().pathname

  const [isOrder] = React.useState(router.includes('/orders'))

  return (
    <div className='space-x-4'>
      {/* <Button onClick={saveItem}>
        Сохранить
      </Button> */}
      {item?.status === 'waiting' && (
        <Button
          color={'green'}
          px={30}
          onClick={() => confirmModal('Вы действительно хотите принять заявку?', 'adopted', 'Подтвердить')}
        >
          Принять
        </Button>
      )}
      {item?.status === 'suggested' && (
        <Button
          color={'green'}
          px={30}
          onClick={() => confirmModal('Вы действительно хотите заключить заявку?', 'done', 'Подтвердить')}
          disabled={again || !item?.our_cost}
        >
          Заключить
        </Button>
      )}
      {item?.status === 'raw' && (
        <Button
          color={'green'}
          px={30}
          disabled={!item?.duration}
          onClick={() => confirmModal('Вы действительно хотите принять заявку?', 'adopted', 'Подтвердить')}
        >
          Принять
        </Button>
      )}
      
      {(admin && (item?.status === 'rejected')) && (
        <Button 
          color={'green'} 
          variant={'outline'} 
          px={30} onClick={() => rejectModal('Вы действительно хотите восстановить заявку?', 'raw', 'Восстановить')}
        >
          Восстановить
        </Button>
      )}
      {((item?.status === 'raw') || (item?.status === 'adopted') || (item?.status === 'suggested') || (item?.status === 'waiting')) && (
        <Button 
          color={'red'} 
          variant={'outline'} 
          px={30} onClick={() => rejectModal('Вы действительно хотите принять заявку?', 'rejected', 'Отклонить')}
        >
          Отклонить
        </Button>
      )}
      
      {item?.status === 'suggested' && (
        <Button
          color={'yellow'}
          px={30}
          onClick={() => setAgain(true)}
          variant='subtle'
        >
          Переподача
        </Button>
      )}

      <Button
        color={'green'}
        className='mt-4'
        onClick={() => confirmModal('Вы действительно хотите отправить заявку?', 'suggested', 'Отправить')}
      >
        Отправить
      </Button>
      <div className='space-y-4'>
        <Textarea
          value={item?.more_data ?? ''}
          onChange={e => setItem({ ...item, more_data: e.target.value })}
        />
        <Button
          onClick={() => confirmModal('Вы действительно хотите подтребовать больше данных?', 'waiting', 'Больше данных')}
          disabled={!item?.more_data}
        >
          Больще данных
        </Button>
      </div>
      <Collapse in={again}>
        <div className='space-y-4 mt-6'>
          <div className={styles.block}>
            <p className={styles.label}>Количество</p>
              <TextInput
                value={newItem?.count ?? ''}
                name='count'
                onChange={(q) => setNewItem({ ...newItem, count: q.target.value })}
              />
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Бюджет</p>
              <TextInput
                value={newItem?.cost ?? ''}
                name='cost'
                onChange={(q) => setNewItem({ ...newItem, cost: q.target.value })}
              />
          </div>

          <div className={styles.block}>
            <p className={styles.label}>Описание</p>
              <Textarea
                value={newItem?.description ?? ''}
                name='description'
                onChange={(q) => setNewItem({ ...newItem, description: q.target.value })}
                classNames={{
                  input: 'h-44'
                }}
              />
          </div>
          <div className={styles.block}>
            <p className={styles.label}>Срок исполнения</p>
              <NumberInput
                value={newItem?.duration ?? ''}
                name='duration'
                onChange={(q) => setNewItem({ ...newItem, duration: q })}
                rightSection='дней'
                classNames={{
                  rightSection: 'mr-4'
                }}
              />
            </div>
          <div className='space-x-4'>
            <Button
              color={'yellow'}
              px={30}
              onClick={() => confirmModal('Вы действительно хотите переподать заявку?', 'adopted', 'Переподать')}
            >
              Переподача
            </Button>
            <Button
              color={'yellow'}
              px={30}
              onClick={() => setAgain(false)}
              variant='subtle'
            >
              Отмена
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  )
}

export default ItemActions