import React from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, query } from 'firebase/firestore'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import useAuth from '../hooks/useAuth'
import { auth, db } from '../utlis/firebase'
import Header from './Header'
import Sidebar from './Sidebar'

export const PermissionContext = React.createContext(null)

export const DataContext = React.createContext(null)

function Layout({ children }) {

  const {user} = useAuth()
  const [logged, setLogged] = React.useState(false)
  React.useEffect(() => {
    onAuthStateChanged(auth, user => { 
      if (user) setLogged(true)
      else setLogged(false)
    }) 
  }, [user])

  const service = user?.email?.includes('service')
  const purchase = user?.email?.includes('purchase')
  const logist = user?.email?.includes('logist')
  const transac = user?.email?.includes('transac')
  const manager = user?.email?.includes('manager')
  const admin = user?.email?.includes('abylay19961996@gmail.com')

  const [items] = useCollectionData(query(collection(db, logist ? ' ' : user ? 'items' : ' ' ))) 
  const [tracks] = useCollectionData(query(collection(db, (logist || manager || admin) ? user ? 'track' : ' ' : ' '))) 
  const [consults] = useCollectionData(query(collection(db, logist ? ' ' : user ? 'consults' : ' '))) 
  
  const [tarif] = useDocumentData(doc(db, 'tarif', 'tarif')) 
  const [userData] = useDocumentData(doc(db, 'users', user?.email ?? ' ')) 

  const [opened, setOpened] = React.useState(false)

  return (
    <PermissionContext.Provider value={{ service, purchase, logist, transac, manager, admin, tarif, userData}}>
      <DataContext.Provider value={{items, consults, tracks}}>
        <div className='grid grid-rows-[auto_1fr] min-h-screen  dark:bg-[#1A1B1E] dark:text-white'>
          <Header 
            opened={opened}
            setOpened={setOpened}
          />
          <div className='grid grid-cols-[110px_auto]'>
            <Sidebar 
              opened={opened}
              setOpened={setOpened}
            /> 
            <div className='w-full px-4'>
              {children}
            </div>
            {!logged && (
              <div></div>
            )}
          </div>
        </div>
      </DataContext.Provider>
    </PermissionContext.Provider>
  )
}


export const withLayout = (Component) => {
  return function withLayoutComponent(props) {
    return (
      <Layout>
        <Component {...props} />
      </Layout>
    )
  }
}

