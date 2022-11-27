import React from 'react'
import Link from 'next/link'

function Header() {

  return (
    <div className='w-full border-b py-4'>
      <div className='flex'>
        <div className='px-4'>
          <Link href={'/'}>
            OPTOBOX
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Header