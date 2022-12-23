import { Table } from '@mantine/core';
import React from 'react'
import { BidsContext } from '../../layout/Layout';

const styles = {
  heading: 'text-2xl mb-4'
}

function AllManagerStats({managers}) {

  const {items, consults, tracks} = React.useContext(BidsContext)
  
  // manager
  const managerTracks = tracks?.filter(e => {
    return e?.manager?.email?.includes('manager')
  })

  const managerBids = items?.filter(e => {
    return e?.service_manager?.email?.includes('manager')
  })

  const managerConsults = consults?.filter(e => {
    return e?.manager?.email?.includes('manager')
  })
  //

  const logistTracks = tracks?.filter(e => {
    return e?.manager?.email?.includes('logist')
  })


  const serviceBids = items?.filter(e => {
    return e?.service_manager?.email?.includes('service')
  })
  
  const serviceConsults = consults?.filter(e => {
    return e?.manager?.email?.includes('manager')
  })
  //

  //purchase 
  const purchaseBids = items?.filter(e => {
    return e?.purchase_manager?.email?.includes('purchase')
  })
  //

  const filterBids = (array, a, b, c, d, f) => {
    return array?.filter(e => {
      return e?.[a] == b || (c && (e?.[a] == c)) || (d && (e?.[a] == d)) || (f && (e?.[a] == f))
    })?.length
  }

  const managerBidsMap = new Map(
    managerBids?.map(e => {
      const email = e?.service_manager?.email
      return [email, managerBids?.filter(q => { 
        return q?.service_manager?.email == email
      })] 
    })
  )

  const serviceBidsMaps = new Map(
    serviceBids?.map(e => {
      const email = e?.service_manager?.email
      return [email, serviceBids?.filter(q => { 
        return q?.service_manager?.email == email
      })] 
    })
  )

  const managerTracksMaps = new Map(
    managerTracks?.map(e => {
      const email = e?.manager?.email
      return [email, managerTracks?.filter(q => { 
        return q?.manager?.email == email
      })] 
    })
  )

  const logistTracksMaps = new Map(
    logistTracks?.map(e => {
      const email = e?.manager?.email
      return [email, logistTracks?.filter(q => { 
        return q?.manager?.email == email
      })] 
    })
  )

  const purchaseBidsMaps = new Map(
    purchaseBids?.map(e => {
      const email = e?.purchase_manager?.email
      return [email, purchaseBids?.filter(q => { 
        return q?.purchase_manager?.email == email
      })] 
    })
  )

  return (
    <div className='space-y-8'>
      <div>
        <h2 className={styles.heading}>Главный менеджер заявки</h2>
        <Table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Консул.</th>
              <th>Заявки</th>
              <th>В работе</th>
              <th>Предложенные</th>
              <th>Заключено</th>
              <th>Отклонено</th>
              <th>Доход</th>
            </tr>
          </thead>
          <tbody>
            {[...managerBidsMap.values()].map((e, i) => {
              const zxc = e?.map(e => {return e?.service_manager})
              return (
                <tr key={i}>
                  <td>{e?.service_manager?.email}</td>
                  <td>{0}</td>
                  <td>{filterBids(e, 'status', 'ended')}</td>
                  <td>{filterBids(e, 'status', 'adopted', 'waiting')}</td>
                  <td>{filterBids(e, 'status', 'suggested')}</td>
                  <td>{filterBids(e, 'status', 'done')}</td>
                  <td>{filterBids(e, 'status', 'rejected')}</td>
                  <td>{0}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
      <div>
        <h2 className={styles.heading}>Главный менеджер посылки</h2>
        <Table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Посылки</th>
              <th>В работе</th>
              <th>Отменено</th>
              <th>Доставки</th>
              <th>В пути</th>
              <th>Доход</th>
            </tr>
          </thead>
          <tbody>
            {[...managerTracksMaps.values()].map((e, i) => {
              const deliveries = e?.map(e => {return e?.deliveries}).flat()
              return (
                <tr key={i}>
                  <td>{}</td>
                  <td>{filterBids(deliveries, 'step', 5)}</td>
                  <td>{e?.length}</td>
                  <td>{filterBids(deliveries, 'status', 'canceled')}</td>
                  <td>{filterBids(e, 'done', true)}</td>
                  <td>{filterBids(deliveries, 'status', 'confirmed')}</td>
                  <td>{0}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
      <div>
        <h2 className={styles.heading}>Сервис менеджер</h2>
        <Table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Консул.</th>
              <th>Заявки</th>
              <th>В работе</th>
              <th>Предложенные</th>
              <th>Заключено</th>
              <th>Отклонено</th>
              <th>Доход</th>
            </tr>
          </thead>
          <tbody>
            {[...serviceBidsMaps.values()].map((e, i) => {
              return (
                <tr key={i}>
                  <td>{}</td>
                  <td>{filterBids(serviceConsults, 'status', 'done')}</td>
                  <td>{filterBids(e, 'status', 'ended')}</td>
                  <td>{filterBids(e, 'status', 'adopted', 'waiting')}</td>
                  <td>{filterBids(e, 'status', 'suggested')}</td>
                  <td>{filterBids(e, 'status', 'done')}</td>
                  <td>{filterBids(e, 'status', 'rejected')}</td>
                  <td>{0}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
      <div>
        <h2 className={styles.heading}>Логист менеджер</h2>
        <Table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Посылки</th>
              <th>В работе</th>
              <th>На складе</th>
              <th>Отменено</th>
              <th>Доставки</th>
              <th>В пути</th>
              <th>Доход</th>
            </tr>
          </thead>
          <tbody>
            {[...logistTracksMaps.values()].map((e, i) => {
              const deliveries = e?.map(e => {return e?.deliveries}).flat()
              return (
                <tr key={i}>
                  <td>{}</td>
                  <td>{filterBids(deliveries, 'step', 5)}</td>
                  <td>{filterBids(deliveries, 'status', 'waiting', 'pending', 'failed')}</td>
                  <td>{filterBids(deliveries, 'status', 'confirmed')}</td>
                  <td>{filterBids(deliveries, 'status', 'canceled')}</td>
                  <td>{filterBids(e, 'done', true)}</td>
                  <td>{filterBids(deliveries, 'isTracking', true)}</td>
                  <td>{0}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
      <div>
        <h2 className={styles.heading}>Закупщик менеджер</h2>
        <Table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Заказы</th>
              <th>В работе</th>
              <th>Предложено</th>
              <th>Доход</th>
            </tr>
          </thead>
          <tbody>
            {[...purchaseBidsMaps.values()].map((e, i) => {
              return (
                <tr key={i}>
                  <td>{}</td>
                  <td>{filterBids(e, 'status', 'ended')}</td>
                  <td>{filterBids(e, 'status', 'waiting', 'done')}</td>
                  <td>{filterBids(e, 'status', 'suggested')}</td>
                  <td>{0}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default AllManagerStats