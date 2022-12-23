import React from 'react'
import { collection, query } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import useAuth from '../../hooks/useAuth'
import { db } from '../../utlis/firebase'
import Cell from '../Cell'

function ManagerStats() {

  const {user} = useAuth()

  const items = []
  const consults = []

  const managerBids = items?.filter(e => {
    return e.service_manager?.uid === user?.uid
  })

  const managerConsults = items?.filter(e => {
    return e.manager?.uid === user?.uid
  })

  const managerTracks = items?.filter(e => {
    return e.logist_manager?.uid === user?.uid
  })

  const doneCunsults = managerConsults?.filter(e => {
    return e.status === 'done'
  })

  const endedTracks = managerTracks?.filter(e => {
    return e.ended === true
  })

  const endedBids = managerBids?.filter(e => {
    return e.status === 'ended'
  })

  const suggestedBids = managerBids?.filter(e => {
    return e.status === 'suggested'
  })

  const endedDeliveries = endedTracks?.map(e => {
    return e.deliveries
  }).flat().filter(e => {
    return e.status === ''
  })




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