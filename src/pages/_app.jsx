import '../styles/globals.css'
import { withLayout } from '../layout/Layout'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { theme } from '../utlis/theme'


function MyApp({ Component, pageProps }) {


  return (
    <MantineProvider
      theme={theme}
    >
      <ModalsProvider>  
        <NotificationsProvider position='top-right'>
          <Component {...pageProps} />
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  )
}

export default withLayout(MyApp) 
