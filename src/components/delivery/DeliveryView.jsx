import React from 'react'
import { Button, Collapse } from '@mantine/core'

import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../utlis/firebase'

import { PermissionContext } from '../../layout/Layout'
import useAuth from '../../hooks/useAuth'
import DeliveryBody from './DeliveryBody'
import DeliverySteps from './DeliverySteps'
import DeliveryNote from './DeliveryNote'
import DeliveryDetails from './DeliveryDEtails'


function DeliveryView({values = []}) {

  const {manager, logist, admin, tarif} = React.useContext(PermissionContext)

  const {user} = useAuth()

  const [item, setItem] = React.useState({})
  const [selected, setSelected] = React.useState(null)

  const isTracking = item?.isTracking

  React.useEffect(() => {
    setItem(values?.find(e => e.id === item?.id))
  }, [values])

  const handleSelected = (id, item, i) => {
    setSelected(id)
    setItem(item)
  }

  const takeTrack = async () => {
    await updateDoc(doc(db, 'track', item?.id), {
      manager: {
        uid: user?.uid,
        email: user?.email,
        displayName: user?.displayName
      },
      logist_tarif: tarif?.logist_manager
    })
  }
  const [visible, setVisible] = React.useState(false)

  return (
    <div className='grid grid-cols-1 md:grid-cols-[55%_auto]'>
      <DeliveryBody
        values={values}
        handleSelected={handleSelected}
        selected={selected}
      />
      {selected && (
        <div className='space-y-4 dark:bg-slate-800'>
          <DeliveryDetails
            item={item}            
            setItem={setItem}
          />
          <Button
            onClick={() => setVisible(q => !q)}
          >
            Накладная
          </Button>
          <Collapse in={visible}>
            <DeliveryNote
              item={item}
              setItem={setItem}
            />
            {isTracking && (
              <DeliverySteps
                item={item}
              />
            )}
          </Collapse>
          {(!item?.manager && !item?.isTracking) && (
            <Button onClick={takeTrack}>
              Принять
            </Button>
          )}
        </div>
      )}
    </div>
  )
}




export default DeliveryView