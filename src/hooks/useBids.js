import React from 'react'
import { collection, limit, onSnapshot, orderBy, query, startAfter, where } from 'firebase/firestore'
import { db } from '../utlis/firebase'
import useAuth from './useAuth'

function useBids({service, admin, logist, transac}) {

  const { user } = useAuth()

  const [rawBids, setRawBids] = React.useState([])
  const [waitingBids, setWaitingBids] = React.useState([])
  const [adoptedBids, setAdoptedBids] = React.useState([])
  const [suggestedBids, setSuggestedBids] = React.useState([])
  const [rejectedBids, setRejectedBids] = React.useState([])
  const [doneBids, setDoneBids] = React.useState([])
  const [endedBids, setEndedBids] = React.useState([])

  const [lastRaw, setLastRaw] = React.useState()
  const [lastWaiting, setLastWaiting] = React.useState()
  const [lastAdopted, setLastAdopted] = React.useState()
  const [lastSuggested, setLastSuggested] = React.useState()
  const [lastRejected, setLastRejected] = React.useState()
  const [lastDone, setLastDone] = React.useState()
  const [lastEnded, setLastEnded] = React.useState()

  const setData = (status, data) => {
    switch(status) {
      case 'raw': 
        return setRawBids([...rawBids, ...data])
      case 'suggested': 
        return setSuggestedBids([...suggestedBids, ...data])
      case 'rejected': 
        return setRejectedBids([...rejectedBids, ...data])
      case 'waiting': 
        return setWaitingBids([...waitingBids, ...data])
      case 'done': 
        return setDoneBids([...doneBids, ...data])
      case 'ended': 
        return setEndedBids([...endedBids, ...data])
      case 'adopted': 
        return setAdoptedBids([...adoptedBids, ...data])
    }
  }

  const setLast = (status, last) => {
    switch(status) {
      case 'raw': 
        return setLastRaw(last)
      case 'suggested': 
        return setLastSuggested(last)
      case 'rejected': 
        return setLastRejected(last)
      case 'waiting': 
        return setLastWaiting(last)
      case 'done': 
        return setLastDone(last)
      case 'ended': 
        return setLastEnded(last)
      case 'adopted': 
        return setLastAdopted(last)
    }
  }

  const getLast = (status) => {
    switch(status) {
      case 'raw': 
        return lastRaw
      case 'suggested': 
        return lastSuggested
      case 'rejected': 
        return lastRejected
      case 'waiting': 
        return lastWaiting
      case 'done': 
        return lastDone
      case 'ended': 
        return lastEnded
      case 'adopted': 
        return lastAdopted
    }
  }

  const condition = () => {
    if (service) return 'service_email'
    return 'purchase_email'
  }

  const snapshotQuery = (status, callback, last) => {
    if (admin || !user || logist || transac) return 
    const q = query(collection(db, status),
    where(condition(), '==', user?.email ?? ' '),
    limit(5));
    onSnapshot(q, (querySnapshot) => {
      const elements = [];
      querySnapshot.forEach((doc) => {
        elements.push(doc.data());
      });
      last(querySnapshot.docs[querySnapshot.docs.length-1])
      callback(elements)
    });
  }

  const getRaw = (callback, last) => {
    if (admin || !user || logist || transac) return
    const q = query(collection(db, 'raw'),
    orderBy('createdAt', 'asc'),
    limit(5));
    onSnapshot(q, (querySnapshot) => {
      const elements = [];
      querySnapshot.forEach((doc) => {
        elements.push(doc.data());
      });
      last(querySnapshot.docs[querySnapshot.docs.length-1])
      callback(elements)
    });
  }

  const getAdopted = (callback, last) => {
    if (admin || !user || transac || logist) return
    const q = query(collection(db, 'adopted'),
    orderBy('createdAt', 'asc'),
    limit(5));
    onSnapshot(q, (querySnapshot) => {
      const elements = [];
      querySnapshot.forEach((doc) => {
        elements.push(doc.data());
      });
      last(querySnapshot.docs[querySnapshot.docs.length-1])
      callback(elements)
    });
  }

  const loadMore = async status => {
    if (!user) return
    const q = query(collection(db, status),
    orderBy('createdAt', 'asc'),
    startAfter(getLast(status)),
    limit(5));
    onSnapshot(q, querySnapshot => {
      console.log(querySnapshot);
      const elements = [];
      console.log(querySnapshot.size)
      if (querySnapshot.size !== 0) {
        querySnapshot.forEach((doc) => {
          elements.push(doc.data());
        });
        setLast(status, querySnapshot.docs[querySnapshot.docs.length-1])
        setData(status, elements)
      }
    })
  }

  const loadMoreByManager = async status => {
    if (!user) return
    const q = query(collection(db, status),
    where(condition(), '==', user?.email),
    startAfter(getLast(status)),
    limit(5));
    onSnapshot(q, querySnapshot => {
      const elements = [];
      console.log(querySnapshot.size)
      if (querySnapshot.size !== 0) {
        querySnapshot.forEach((doc) => {
          elements.push(doc.data());
        });
        setLast(status, querySnapshot.docs[querySnapshot.docs.length-1])
        setData(status, elements)
      }
    }, (err) => {
      console.log(err);
    })
  }

  React.useEffect(() => {
    getRaw(setRawBids, setLastRaw)
    getAdopted(setAdoptedBids, setLastAdopted)

    snapshotQuery('suggested', setSuggestedBids, setLastSuggested)
    snapshotQuery('waiting', setWaitingBids, setLastWaiting)
    snapshotQuery('rejected', setRejectedBids, setLastRejected)
    snapshotQuery('done', setDoneBids, setLastDone)
    snapshotQuery('ended', setEndedBids, setLastEnded)
  }, [user])

  return {
    rawBids, 
    adoptedBids,
    suggestedBids,
    rejectedBids,
    waitingBids,
    doneBids,
    endedBids,
    loadMore,
    loadMoreByManager,
  }
}

export default useBids