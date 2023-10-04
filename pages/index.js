// ** React Imports
import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { useAuth } from '../hooks/useAuth'


const Home = () => {
  // ** Hooks
  const auth = useAuth()
  console.log(auth, 'homeRoute............')
  const router = useRouter()
  useEffect(() => {
    if (auth.user) {
      router.replace( '/dashboard')
    } else {
      console.log('logout user')
      router.replace('/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

 return
}

export default Home
