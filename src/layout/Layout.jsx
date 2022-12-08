import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, query } from 'firebase/firestore'
import React from 'react'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import useAuth from '../hooks/useAuth'
import { auth, db } from '../utlis/firebase'
import Header from './Header'
import Sidebar from './Sidebar'

const styles = {
  wrapper: 'grid grid-rows-[auto_1fr] min-h-screen',
}

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

  const [opened, setOpened] = React.useState(false)

  return (
    <PermissionContext.Provider value={{ service, purchase, logist, transac, manager, admin, tarif }}>
      <DataContext.Provider value={{items, consults, tracks}}>
        <div className={styles.wrapper}>
          <Header 
            opened={opened}
            setOpened={setOpened}
          />
          <div className='flex gap-x-4'>
            <Sidebar 
              opened={opened}
              setOpened={setOpened}
            /> 
            <div className='mt-4 w-full p-4'>
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

