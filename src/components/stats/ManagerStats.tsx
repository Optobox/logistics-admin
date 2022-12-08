import { collection, query } from 'firebase/firestore'
import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import useAuth from '../../hooks/useAuth'
import { db } from '../../utlis/firebase'
import Cell from '../Cell'

function ManagerStats() {

  const [consults] = useCollectionData(query(collection(db, 'consults')))
  const [items] = useCollectionData(query(collection(db, 'items')))

  const {user} = useAuth()

  const doneItems = items?.filter((e) => {
    return (e.status === 'done') && e.service_manager?.uid == user?.uid
  })

  const suggestedItems = items?.filter(e => {
    return (e.status === 'suggested') && e.service_manager?.uid == user?.uid
  })
  
  const doneConsult = consults?.filter(e => {
    return (e.status === 'done') && e.service_manager?.uid == user?.uid
  })

  return (
    <div className='grid grid-cols-2 gap-4 max-w-lg'>

    </div>
  )
}

export default ManagerStats