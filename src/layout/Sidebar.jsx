import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { PermissionContext } from './Layout'
import useAuth from '../hooks/useAuth'
import { Drawer } from '@mantine/core'

import { ImCreditCard } from 'react-icons/im'
import { FiStar } from 'react-icons/fi'
import { HiOutlineUsers } from 'react-icons/hi'
import { MdWorkOutline } from 'react-icons/md'
import { TbListDetails, TbReportMoney } from 'react-icons/tb'
import { RiQuestionnaireLine } from 'react-icons/ri'
import { FiShoppingCart } from 'react-icons/fi'
import { BsTruck, BsBoxSeam } from 'react-icons/bs'



function Sidebar({opened, setOpened}) {

  const router = useRouter()
  const styles = {
    link: `px-2 py-5  cursor-pointer h-min flex flex-col items-center`,
    activeLink: 'bg-blue-500 text-white',
    label: 'text-xs ',
    icon: 'text-2xl '
  }

  const {user, loading} = useAuth()

  const {manager, admin, transac, service, purchase, logist} = React.useContext(PermissionContext)

  if (loading) return <div></div>

  if (!user) return <div></div>

  return (
    <>

      {/* <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        overlayOpacity={0.2}
        position='left'
      > */}
      <div className=''>
        <div className='grid grid-cols-2 lg:grid-cols-1 h-min text-base'>

          {((!purchase || transac) && (purchase || !transac))  && (
            !logist && (
              <>
                <Link href={'/consults'}>
                  <div className={cn(styles.link, {
                    [styles.activeLink]: router.pathname === '/consults'}
                    )}
                  >
                    <RiQuestionnaireLine className={styles.icon}/>
                    <span className={styles.label}>
                      Консультации
                    </span>
                  </div>
                </Link>
                <Link href={'/bids'}>
                  <div className={cn(styles.link, {
                    [styles.activeLink]: router.pathname === '/bids'}
                    )}
                  >
                  <TbListDetails className={styles.icon}/>
                    <span className={styles.label}>
                      Заявки
                    </span>
                  </div>
                </Link>
              </>
            )
          )}
          {((!transac || logist) && (transac || !logist)) && (        
            <Link href={'/orders'}>
              <div className={cn(styles.link, {
                [styles.activeLink]: router.pathname === '/orders'})}
              >
                <FiShoppingCart className={styles.icon}/>
                <span className={styles.label}>
                  Заказы товаров
                </span>
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
                    <BsBoxSeam className={styles.icon}/>
                    <span className={styles.label}>
                      Посылки
                    </span>
                  </div>
                </Link>
                <Link href={'/track'}>
                  <div className={cn(styles.link, {
                    [styles.activeLink]: router.pathname === '/track'}
                    )}
                  >
                    <BsTruck className={styles.icon}/>
                    <span className={styles.label}>
                      Отслеживание
                    </span>
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
                <ImCreditCard className={styles.icon}/>
                <span className={styles.label}>
                  Транзакции
                </span>
              </div>
            </Link>
          )}
          {(admin || manager) && (
            <>
              <Link href={'/managers'}>
                <div className={cn(styles.link, {
                  [styles.activeLink]: router.pathname === '/managers'}
                  )}
                >
                  <MdWorkOutline className={styles.icon}/>
                  <span className={styles.label}>
                    Менеджеры
                  </span>
                </div>
              </Link>
              <Link href={'/users'}>
                <div className={cn(styles.link, {
                  [styles.activeLink]: router.pathname === '/users'}
                  )}
                >
                  <HiOutlineUsers  className={styles.icon}/>
                  <span className={styles.label}>
                    Пользователи
                  </span>
                </div>
              </Link>
              {admin && (
                <Link href={'/reviews'}>
                  <div className={cn(styles.link, {
                    [styles.activeLink]: router.pathname === '/reviews'}
                    )}
                  >
                    <FiStar  className={styles.icon}/>
                    <span className={styles.label}>
                      Отзывы
                    </span>
                  </div>
                </Link>
              )}
              {admin && (
                <Link href={'/finances'}>
                  <div className={cn(styles.link, {
                    [styles.activeLink]: router.pathname === '/finances'}
                    )}
                  >
                    <TbReportMoney  className={styles.icon}/>
                    <span className={styles.label}>
                      Финансы
                    </span>
                  </div>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
      {/* </Drawer> */}
    </>
  )
}

export default Sidebar