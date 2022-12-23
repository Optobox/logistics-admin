import React from 'react'
import { collection, limit, onSnapshot, orderBy, query, startAfter, where } from 'firebase/firestore'
import { db } from '../utlis/firebase'
import useAuth from './useAuth'

function useTracks({admin, service, purchase, transac}) {

  const { user } = useAuth()

  const [active, setActive] = React.useState([])
  const [working, setWorking] = React.useState([])
  const [tracking, setTracking] = React.useState([])
  const [delivered, setDelivered] = React.useState([])

  const [lastActive, setLastActive] = React.useState()
  const [lastWorking, setLastWorking] = React.useState()
  const [lastTracking, setLastTracking] = React.useState()
  const [lastDelivered, setLastDelivered] = React.useState()

  const setData = (status, data) => {
    switch(status) {
      case 'active': 
        return setActive([...active, ...data])
      case 'working': 
        return setWorking([...working, ...data])
      case 'tracking': 
        return setTracking([...tracking, ...data])
      case 'delivered': 
        return setDelivered([...delivered, ...data])
    }
  }

  const setLast = (status, last) => {
    switch(status) {
      case 'active': 
        return setLastActive(last)
      case 'working': 
        return setLastWorking(last)
      case 'tracking': 
        return setLastTracking(last)
      case 'delivered': 
        return setLastDelivered(last)
    }
  }

  const getLast = (status) => {
    switch(status) {
      case 'active': 
        return lastActive
      case 'working': 
        return lastWorking
      case 'tracking': 
        return lastTracking
      case 'delivered': 
        return lastDelivered
    }
  }

  const snapshotQuery = (status, callback, last) => {
    if (!user || service || purchase || transac) return 
    const q = query(collection(db, status),
    where('manager_email', '==', user?.email ?? ' '),
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

  const getActive = (callback, last) => {
    if (!user || service || purchase || transac) return
    const q = query(collection(db, 'active'),
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

  const loadMoreTracks = async status => {
    if (!user) return
    const q = query(collection(db, status),
    orderBy('createdAt', 'asc'),
    startAfter(getLast(status)),
    limit(5));
    onSnapshot(q, querySnapshot => {
      const elements = [];
      if (querySnapshot.size !== 0) {
        querySnapshot.forEach((doc) => {
          elements.push(doc.data());
        });
        setLast(status, querySnapshot.docs[querySnapshot.docs.length-1])
        setData(status, elements)
      }
    })
  }

  const loadMoreTracksByManager = async status => {
    if (!user) return
    const q = query(collection(db, status),
    where('manager_email', '==', user?.email),
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
    getActive(setActive, setLastActive)

    snapshotQuery('working', setWorking, setLastWorking)
    snapshotQuery('tracking', setTracking, setLastTracking)
    snapshotQuery('delivered', setDelivered, setLastDelivered)
  }, [user])

  return {
    active, 
    working,
    tracking,
    delivered,
    loadMoreTracks,
    loadMoreTracksByManager,
  }
}

export default useTracks