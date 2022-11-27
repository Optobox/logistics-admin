import { collection, query } from 'firebase/firestore'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { auth, db } from '../../utlis/firebase'
import Cell from '../Cell'

function PurchaseStats() {

  const [consults] = useCollectionData(query(collection(db, 'consults')))
  const [items] = useCollectionData(query(collection(db, 'items')))

  const [user] = useAuthState(auth)

  const doneItems = items?.filter((e) => {
    return (e.status === 'done') && e.purchase_manager?.uid == user?.uid
  })

  const suggestedItems = items?.filter(e => {
    return (e.status === 'suggested') && e.service_manager?.uid == user?.uid
  })
  
  const doneConsult = consults?.filter(e => {
    return (e.status === 'done') && e.service_manager?.uid == user?.uid
  })
  return (
    <div className='grid grid-cols-2 gap-4'>
      <Cell
        label='Заказы'
        value={doneItems?.length}
        def='Завершено'
      />
      <Cell
        label='Доход'
        value={0}
        def='тенге'
      />
    </div>
  )
}

export default PurchaseStats