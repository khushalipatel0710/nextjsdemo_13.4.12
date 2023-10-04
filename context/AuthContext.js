// ** React Imports
import { createContext, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'


// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  reload: true,
  setUser: () => null,
  setLoading: () => Boolean,
  setReload: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  initAuth: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem('accessToken')
      console.log(storedToken, 'dp1')
      if (storedToken) {
        setLoading(false)
        await axios
          .get('/api/auth', {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            console.log(response.data[1], 'userdata set')
            setUser({ ...response.data[1].userData })
            window.localStorage.setItem(
              'userData',
              JSON.stringify({
                ...JSON.parse(window.localStorage.getItem('userData')),
                userData: response.data[1].userData
              })
            )
            router.replace('/dashboard')
          })

          .catch(() => {
            if (!router.pathname.includes('login')) {
              router.replace('/dashboard')
            }
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
          })
      } else {
        console.log('router.pathname', router.pathname)

        if (router.pathname == '/dashboard') {
          router.replace('/login')
          setLoading(false)
        } else {
          setLoading(false)
        }
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initAuth = async () => {
    const storedToken = window.localStorage.getItem('accessToken')

    if (storedToken) {
      console.log(storedToken)
      setLoading(false)
      await axios
        .get('/api/auth', {
          headers: {
            Authorization: storedToken
          }
        })
        .then(async response => {
          setLoading(false)
          console.log(response.data[1], 'userdata set')
          setUser({ ...response.data[1].userData })
          window.localStorage.setItem(
            'userData',
            JSON.stringify({
              ...window.localStorage.getItem('userData'),
              userData: response.data[1].userData
            })
          )
          router.replace('/dashboard')
        })

        .catch(e => {
          console.log('e____________', e)
          if (!router.pathname.includes('/login')) {
            router.replace('/login')
          }
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          setLoading(false)
          setUser(null)
        })
    } else {
      console.log('storedToken', storedToken)
      setLoading(false)
    }
  }

  const handleLogin = (params, errorCallback) => {
    console.log('/api/login')
    console.log('params.....', params)

    axios
      .post("/api/login", params)
      .then(async response => {
        
           window.localStorage.setItem("accessToken", response.data.accessToken)
        
        const returnUrl = router.query.returnUrl
        console.log(response, "accessToken", 'kk', response.data.accessToken)
        console.log('kkp', response.data)

        // return
        setUser({ ...response.data })
        window.localStorage.setItem('userData', JSON.stringify(response.data)) 
      
        const redirectURL = returnUrl && returnUrl !== '/dashboard' ? returnUrl : '/dashboard'

        console.log(redirectURL)

        router.replace(redirectURL)
      })
      .catch(err => {
        if (err?.response?.data) {
          if (errorCallback) errorCallback(err.response.data)
        } else {
          if (errorCallback) errorCallback(err)
        }
      })
  }


  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    initAuth: initAuth
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
