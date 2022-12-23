import React from 'react'
import { collection, doc, query } from 'firebase/firestore'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import useAuth from '../hooks/useAuth'
import { db } from '../utlis/firebase'
import Header from './Header'
import Sidebar from './Sidebar'
import useBids from '../hooks/useBids'
import useConsults from '../hooks/useConsults'
import useTracks from '../hooks/useTracks'

export const PermissionContext = React.createContext(null)
export const BidsContext = React.createContext(null)
export const ConsultContext = React.createContext(null)
export const TrackContext = React.createContext(null)
export const DataContext = React.createContext(null)

function Layout({ children }) {

  const {user} = useAuth()
  const service = user?.email?.includes('service')
  const purchase = user?.email?.includes('purchase')
  const logist = user?.email?.includes('logist')
  const transac = user?.email?.includes('transac')
  const manager = user?.email?.includes('manager')
  const admin = user?.email?.includes('abylay19961996@gmail.com')

  const [tracks] = useCollectionData(query(collection(db, (logist || manager || admin) ? user ? 'track' : ' ' : ' '))) 
  // const [consults] = useCollectionData(query(collection(db, logist ? ' ' : (user && admin) ? 'consults' : ' '))) 

  const [raws] = useCollectionData(query(collection(db, (admin ? 'raw' : ' '))))
  const [suggesteds] = useCollectionData(query(collection(db, (admin ? 'suggested' : ' '))))
  const [waitings] = useCollectionData(query(collection(db, (admin ? 'waiting' : ' '))))
  const [adopteds] = useCollectionData(query(collection(db, (admin ? 'adopted' : ' '))))
  const [dones] = useCollectionData(query(collection(db, (admin ? 'done' : ' '))))
  const [rejecteds] = useCollectionData(query(collection(db, (admin ? 'rejecteds' : ' '))))

  const [actives] = useCollectionData(query(collection(db, (admin ? 'active' : ' '))))
  const [workings] = useCollectionData(query(collection(db, (admin ? 'working' : ' '))))
  const [trackings] = useCollectionData(query(collection(db, (admin ? 'tracking' : ' '))))
  const [delivereds] = useCollectionData(query(collection(db, (admin ? 'delivered' : ' '))))

  const [allConsults] = useCollectionData(query(collection(db, (admin ? 'consults' : ' '))))

  

  const {rawBids, suggestedBids, adoptedBids, rejectedBids, waitingBids, doneBids, endedBids, loadMore, loadMoreByManager } = useBids({
    service: service, 
    admin: admin,
    logist: logist, 
    transac: transac,
  })

  const {active, delivered, working, tracking, loadMoreTracks, loadMoreTracksByManager} = useTracks({
    admin: admin, 
    purchase: purchase, 
    service: service, 
    transac: transac
  })

  const {consults, loadMoreConsults} = useConsults({
    admin: admin, 
    logist: logist, 
    transac: transac
})

  const [tarif] = useDocumentData(doc(db, 'tarif', 'tarif')) 
  const [userData] = useDocumentData(doc(db, 'users', user?.email ?? ' ')) 
  const [stats] = useDocumentData(doc(db, 'records', user?.email ?? ' '))

  const [opened, setOpened] = React.useState(false)

  return (
    <PermissionContext.Provider value={{ service, purchase, logist, transac, manager, admin, tarif, userData }}>
      <DataContext.Provider value={{ 
        raws, 
        suggesteds, 
        adopteds, 
        rejecteds, 
        dones, 
        waitings, 
        consults, 
        tracks, 
        allConsults, 
        actives,
        workings,
        trackings,
        delivereds,
        stats 
        }}
      >
        <BidsContext.Provider value={{ rawBids, suggestedBids, rejectedBids,  waitingBids,  adoptedBids, doneBids, endedBids, loadMore, loadMoreByManager }}>
          <ConsultContext.Provider value={{ consults, loadMoreConsults}}>
            <TrackContext.Provider value={{ active, working, tracking, delivered, loadMoreTracks, loadMoreTracksByManager}}>
              <div className='grid grid-rows-[auto_1fr] min-h-screen  dark:bg-gray-900 dark:text-white'>
                <div>
                  <Header 
                    opened={opened}
                    setOpened={setOpened}
                  /> 
                </div>
                <div className='grid grid-cols-[90px_auto]'>
                  <Sidebar 
                    opened={opened}
                    setOpened={setOpened}
                  /> 
                  <div className='w-full'>
                    {children}
                  </div>
                  {!!user && (
                    <div></div>
                  )}
                </div>
              </div>
            </TrackContext.Provider>
          </ConsultContext.Provider>
        </BidsContext.Provider>
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

