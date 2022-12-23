import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useAuth from '../hooks/useAuth'
import { ActionIcon } from '@mantine/core'
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs'
import useTheme from '../hooks/useTheme'
import { ImExit } from 'react-icons/im'
import logo from '../images/favicon.ico'
import { signOut } from 'firebase/auth'
import { auth } from '../utlis/firebase'
import { useRouter } from 'next/router'

function Header({}) {

  const {user} = useAuth()

  const {theme, handleTeme} = useTheme()

  const router = useRouter()

  const signout = () => {
    signOut(auth)
    router.push('/')
  }

  return (
    <div className='w-full py-2'>
      <div className='flex justify-between items-center gap-4 px-4'>
        <Link href={'/'}>
          <div className='flex items-center gap-2 cursor-pointer'>
            <Image
              src={logo}
            />
            <span className='text-xl font-semibold font-jost'> 
              OptoBox CRM  {user?.email}
            </span>
          </div>
        </Link>
        <div>
          <p className='flex gap-2'>
            <ActionIcon 
              onClick={handleTeme}
            >
              {theme === 'light' ? 
                <BsFillMoonFill />
                :
                <BsFillSunFill/>
              }
            </ActionIcon>
            {!!user && (
              <ActionIcon onClick={signout}>
                <ImExit/>
              </ActionIcon>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Header