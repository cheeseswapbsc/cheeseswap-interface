import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../index'
import { updateMatchesDarkMode } from './actions'

export default function Updater(): null {
  const dispatch = useDispatch<AppDispatch>()

  // Keep the app dark by default. Theme toggles remain user-controlled.
  useEffect(() => {
    dispatch(updateMatchesDarkMode({ matchesDarkMode: true }))
  }, [dispatch])

  return null
}
