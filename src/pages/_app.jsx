import '../styles/globals.css'
import { withLayout } from '../layout/Layout'
import { createEmotionCache, MantineProvider } from '@mantine/core'
import theme from '../utlis/theme'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'

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
