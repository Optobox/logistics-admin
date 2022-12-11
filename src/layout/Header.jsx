import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useAuth from '../hooks/useAuth'
import { ActionIcon, Burger, Button } from '@mantine/core'
import { CgProfile } from 'react-icons/cg'
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs'
import cn from 'classnames'
import useTheme from '../hooks/useTheme'
import { ImExit } from 'react-icons/im'
import logo from '../images/favicon.ico'

function Header({}) {

  const {user} = useAuth()

  const {theme, handleTeme} = useTheme()

  return (
    <div className='w-full py-2'>
      <div className='flex justify-between items-center gap-4 px-6'>
        <Link href={'/'}>
          <div className='flex items-center gap-2 cursor-pointer'>
            <Image
              src={logo}
            />
            <span className='text-xl font-semibold'> 
              OptoBox CRM  
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
            <ActionIcon>
              <ImExit/>
            </ActionIcon>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Header