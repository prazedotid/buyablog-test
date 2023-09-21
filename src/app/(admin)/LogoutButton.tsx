'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  function doSignOut() {
    signOut()
  }

  return (
    <button onClick={doSignOut}>Logout</button>
  )
}