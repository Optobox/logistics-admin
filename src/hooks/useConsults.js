import React from 'react'
import { collection, limit, onSnapshot, query, startAfter, where } from 'firebase/firestore'
import { db } from '../utlis/firebase'
import useAuth from './useAuth'

function useConsults({admin, logist, transac}) {

  const { user } = useAuth()

  const [consults, setConsults] = React.useState([])

  const [lastConsults, setLastConsults] = React.useState([])
  
  const setData = (status, data) => {
    switch(status) {
      case  'raw': 
        return setConsults([...consults, ...data])
    }
  }

  const setLast = (status, last) => {
    switch(status) {
      case  'raw': 
        return setLastConsults(last)
    }
  }

  const getLast = (status) => {
    switch(status) {
      case  'raw': 
        return lastConsults
    }
  }

  const snapshotQuery = (status, callback, last) => {
    if (transac || admin || logist) return
    const q = query(collection(db, "consults"), where("status", "==", status), limit(5));
    onSnapshot(q, (querySnapshot) => {
      const elements = [];
      querySnapshot.forEach((doc) => {
        elements.push(doc.data());
      });
      last(querySnapshot.docs[querySnapshot.docs.length-1])
      callback(elements)
    });
  }

  const loadMoreConsults = async (status) => {
    if (!user) return
    const q = query(collection(db, "consults"),
    where('status', '==', status),
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

  React.useEffect(() => {
    snapshotQuery('raw', setConsults, setLastConsults)
  }, [])

  return {
    consults,
    loadMoreConsults
  }
}

export default useConsults