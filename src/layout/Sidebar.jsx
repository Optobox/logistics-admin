import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../utlis/firebase'
import { PermissionContext } from './Layout'

function Sidebar() {

  const router = useRouter()
  const styles = {
    link: `p-3 lg:p-4 cursor-pointer h-min rounded-mdc`,
    activeLink: 'bg-blue-500 dark:text-white'
  }

  const [user, loading] = useAuthState(auth)

  const {manager, admin, transac, service, purchase, logist} = React.useContext(PermissionContext)
  
  if (loading) return <div></div>

  if (!user) return <div></div>
  
  return (
    <div className='grid grid-cols-2 lg:grid-cols-1 h-min text-base border-r pt-4'>
      {((!purchase || transac) && (purchase || !transac))  && (
        !logist && (
          <>
            <Link href={'/consults'}>
              <div className={cn(styles.link, {
                [styles.activeLink]: router.pathname === '/consults'}
                )}
              >
                Консультации
              </div>
            </Link>
            <Link href={'/bids'}>
              <div className={cn(styles.link, {
                [styles.activeLink]: router.pathname === '/bids'}
                )}
              >
                Заявки
              </div>
            </Link>
          </>
        )
      )}
      {((!transac || logist) && (transac || !logist)) && (        
        <Link href={'/orders'}>
          <div className={cn(styles.link, {
            [styles.activeLink]: router.pathname === '/orders'}
            )}
          >
            Заказы товаров
          </div>
        </Link>
      )}
      {((!service || purchase) && (service || !purchase)) && (
        !transac && (
          <>
            <Link href={'/deliveries'}>
              <div className={cn(styles.link, {
                [styles.activeLink]: router.pathname === '/deliveries'}
                )}
              >
                Посылки
              </div>
            </Link>
            <Link href={'/track'}>
              <div className={cn(styles.link, {
                [styles.activeLink]: router.pathname === '/track'}
                )}
              >
                Отслеживание
              </div>
            </Link>
          </>
        ) 
      )}
      {(manager || transac || admin || transac) && (
        <Link href={'/change'}>
          <div className={cn(styles.link, {
            [styles.activeLink]: router.pathname === '/change'}
            )}
          >
            Перевод средств
          </div>
        </Link>
      )}
      {admin && (
        <>
          <Link href={'/managers'}>
            <div className={cn(styles.link, {
              [styles.activeLink]: router.pathname === '/managers'}
              )}
            >
              Менеджеры
            </div>
          </Link>
          <Link href={'/users'}>
            <div className={cn(styles.link, {
              [styles.activeLink]: router.pathname === '/users'}
              )}
            >
              Пользователи
            </div>
          </Link>
          <Link href={'/reviews'}>
            <div className={cn(styles.link, {
              [styles.activeLink]: router.pathname === '/reviews'}
              )}
            >
              Отзывы
            </div>
          </Link>
          <Link href={'/settings'}>
            <div className={cn(styles.link, {
              [styles.activeLink]: router.pathname === '/settings'}
              )}
            >
              Настройки
            </div>
          </Link>
        </>
      )}
    </div>
  )
}

export default Sidebar