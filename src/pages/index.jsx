import React from 'react'
import Head from 'next/head'
import Login from '../layout/Login'
import { PermissionContext } from '../layout/Layout'
import { UserData } from '../components'
import { ManagerStats, LogistStats, ServiceStats, PurchaseStats, AdminStats } from '../components/stats'
import Profile from './profile'


const Home = () => {

  const {manager, logist, service, purchase, transac, admin} = React.useContext(PermissionContext)

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head> 
      <Profile/>
      <div className='mt-8'>
        {manager && <ManagerStats/>}
        {logist && <LogistStats/>}
        {service && <ServiceStats/>}
        {purchase && <PurchaseStats/>}
        {admin && <AdminStats/>}
        {transac && <></>}
      </div>
      <Login />
    </div>
  )
}

export default Home
