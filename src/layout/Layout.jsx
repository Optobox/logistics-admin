import { onAuthStateChanged } from 'firebase/auth'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../utlis/firebase'
import Header from './Header'
import Sidebar from './Sidebar'

const styles = {
  wrapper: 'grid grid-rows-[auto_1fr] min-h-screen',
  header: '',
  sidebar: '',
  footer: '',
}

export const PermissionContext = React.createContext(null)

function Layout({ children }) {

  const [user] = useAuthState(auth)

  const [logged, setLogged] = React.useState(false)

  React.useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) setLogged(true)
      else {
        setLogged(false)
      }
    }) 
  }, [user])

  const service = user?.email?.includes('service1@optobox.express')
  const purchase = user?.email?.includes('purchase1@optobox.express')
  const logist = user?.email?.includes('logist1@optobox.express')
  const transac = user?.email?.includes('transac1@optobox.express')
  const manager = user?.email?.includes('manager1@optobox.express')
  const admin = user?.email?.includes('abylay19961996@gmail.com')

  return (
    <PermissionContext.Provider value={{ service, purchase, logist, transac, manager, admin}}>
      <div className={styles.wrapper}>
        <Header />
        <div className='grid  lg:grid-cols-[170px_1fr] gap-x-4'>
            <>
              <Sidebar /> 
              <div className='mt-4'>
                {children}
              </div>
            </>
          {!logged && (
            <div></div>
          )}
        </div>
      </div>
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

