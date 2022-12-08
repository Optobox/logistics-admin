import React from 'react'
import { DataContext } from '../../layout/Layout'
import Cell from '../Cell'

function AdminStats() {

  const {items, consults, tracks} = React.useContext(DataContext)

  const deliveries = tracks?.map(e => {
    return e.deliveries
  }).flat()
  
  const filterBids = (array, a, b, c, d, f) => {
    return array?.filter(e => {
      return e?.[a] == b || (c && (e?.[a] == c)) || (d && (e?.[a] == d)) || (f && (e?.[a] == f))
    })
  }

  const activeDeliveries = deliveries?.filter(e => {
    return !e.manager
  })

  const workingDeliveries = tracks?.filter(e => {
    return e.manager?.email
  }).map(e => {return e.deliveries}).flat()

  const deliveredTracks = tracks?.filter(e => {
    return e?.ended == true
  }).map(e => {return e.deliveries}).flat()

  const rejectedWhileSuggestedOrWaiting = items?.filter(e => {
    e.status === 'rejected' && (e.rejected_status === 'suggested' || e.rejected_status === 'waiting')
  })

  const rejectedWhiteRaw = items?.filter(e => {
    e.status === 'rejected' && (e.rejected_status === 'raw')
  })

  const trackPrib = tracks?.filter(e => {
    return e?.isTracking  
  })?.map(e => {
     return (Number(e.weight ?? 0) * Number(e.our_cost ?? 0.5) + (Number(e.cube ?? 0) * Number(e.our_cube ?? 30)))
  })?.reduce((a, b) => a + b, 0)

  const tracksRev = tracks?.filter(e => {
    return e?.ended  
  })?.map(e => {
    return (Number(e.total_cost))
  })?.reduce((a, b) => a + b, 0)

  const tracksValPrib = tracks?.filter(e => {
    return e?.ended  
  })?.map(e => {
    return (Number(e.weight ?? 0) * Number(e.our_cost ?? 0.5) + (Number(e.cube ?? 0) * Number(e.our_cube ?? 30)))
  })?.reduce((a, b) => a + b, 0)

  const logistPrib = tracks?.filter(e => {
    return e?.ended
  })?.map(e => {
    const prib = (Number(e.weight ?? 0) * Number(e.our_cost ?? 0.5) + (Number(e.cube ?? 0) * Number(e.our_cube ?? 30)))
    return (prib * Number(e.logist_tarif)) / 100 
  })?.reduce((a, b) => a + b, 0)

  const pureTracksPrib = tracksValPrib - logistPrib

  const itemsRev = items?.filter(e => {
    return e.status === 'ended'
  })?.map(e => {
    return e.received_sum
  })?.reduce((a, b) => a + b, 0)

  const itemValPrib = items?.filter(e => {
    return e?.status === 'ended'  
  })?.map(e => {
    const cost = e?.urls?.filter(q => {return q.selected === true})[0]?.cost
    return e.received_sum - cost
  })?.reduce((a, b) => a + b, 0)


  const servicePrib = items?.filter(e => {
    return e?.status === 'ended'
  })?.map(e => {
    const cost = e?.urls?.filter(q => {return q.selected === true})[0]?.cost
    const prib = e?.received_sum - cost
    const serv = (prib * Number(e.service_tarif)) / 100
    return serv
  })?.reduce((a, b) => a + b, 0)

  const purchasePrib = items?.filter(e => {
    return e?.status === 'ended'
  })?.map(e => {
    const cost = e?.urls?.filter(q => {return q.selected === true})[0]?.cost
    const prib = e?.received_sum - cost
    const purch = (prib * Number(e.purchase_tarif)) / 100
    return purch
  })?.reduce((a, b) => a + b, 0)

  const pureItemsPrib = itemValPrib - (servicePrib + purchasePrib)

  const allPrib = pureItemsPrib + pureTracksPrib
  const allRev = itemsRev + tracksRev
  const SLPmanagersPrib = (servicePrib + purchasePrib + logistPrib)

  const AKPrib = (allPrib * 65) / 100 
  const ATPrib = (allPrib * 25) / 100
  const AAPrib = (allPrib * 10) / 100 

  return (
    <div className='grid grid-cols-3 gap-'>
      <Cell
        caption='Консультации'
        values={[
          {label: 'Количество:', value: consults},
          {label: 'Проведено:', value: filterBids(consults, 'status', 'done')},
        ]}
      />
      <Cell
        caption='Заявки'
        values={[
          {label: 'В очереди:', value: filterBids(items, 'status', 'raw')},
          {label: 'В работе:', value: filterBids(items, 'status', 'adopted', 'waiting', 'suggested')},
          {label: 'Отклонено:', value: rejectedWhiteRaw},
          {label: 'Подано:', value: items}
        ]}
      />
      <Cell
        caption='Доставки'
        values={[
          {label: 'В пути:', value: filterBids(tracks, 'isTracking', true)},
          {label: 'Ожидаемый доход:', value: trackPrib},
          {label: 'Доставлено:', value: filterBids(tracks, 'ended', true)},
        ]}
      />
      <Cell
        caption='Доставки - Доход'
        values={[
          {label: 'Прибыль:', value: pureTracksPrib},
          {label: 'Выплата:', value: logistPrib},
          {label: 'Оборот:', value: tracksRev},
        ]}
      />
      <Cell
        caption='Заказы - Доход'
        values={[
          {label: 'Прибыль:', value: pureItemsPrib},
          {label: 'Выплата (сервис):', value: servicePrib},
          {label: 'Выплата (закуп):', value: purchasePrib},
          {label: 'Оборот:', value: itemsRev},
        ]}
      />
      <Cell
        caption='Общее '
        values={[
          {label: 'Прибыль:', value: allPrib},
          {label: 'Выплата:', value: SLPmanagersPrib},
          {label: 'Оборот:', value: allRev},
        ]}
      />
      <Cell
        caption='Прибыль'
        values={[
          {label: 'A.K.:', value: AKPrib},
          {label: 'A.T.:', value: ATPrib},
          {label: 'A.A.:', value: AAPrib},
        ]}
      />
      <Cell
        caption='Посылки'
        values={[
          {label: 'В очереди:', value: activeDeliveries},
          {label: 'В работе:', value: filterBids(workingDeliveries, 'status', 'waiting', 'pending', 'failed') },
          {label: 'На складе:', value: filterBids(workingDeliveries, 'status', 'confirmed') },
          {label: 'Отменено:', value: filterBids(workingDeliveries, 'status', 'canceled')},
          {label: 'Доставлено:', value: deliveredTracks},
        ]}
      />
      <Cell
        caption='Заказы товаров'
        values={[
          {label: 'Заключено:', value: filterBids(items, 'status', 'done')},
          {label: 'Предложенные:', value: filterBids(items, 'status', 'suggested') },
          {label: 'Отклоненные:', value: rejectedWhileSuggestedOrWaiting},
          {label: 'Выполнено:', value: filterBids(items, 'status', 'ended') },
        ]}
      />
    </div>
  )
}

export default AdminStats