import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../utlis/firebase'

function useAuth() {

  const [user, loading, error] = useAuthState(auth)

  return {
    user, 
    loading, 
    error
  }
}

export default useAuth