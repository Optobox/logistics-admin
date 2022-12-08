import React from 'react'
import Link from 'next/link'
import useAuth from '../hooks/useAuth'
import { Burger } from '@mantine/core'

function Header({opened, setOpened}) {

  const {user} = useAuth()

  return (
    <>
      <div className='w-full border-b py-4'>
        <div className='flex'>
          <div className='px-4'>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
            />
          
            <Link href={'/'}>
              OPTOBOX
            </Link>
            <p>
              {user?.email}
            </p>
          </div>
        </div>
      </div>

    </>
  )
}

export default Header