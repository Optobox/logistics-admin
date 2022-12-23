import React from 'react'
import { TextInput } from '@mantine/core'
import { randomId } from '@mantine/hooks'
import { addDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../utlis/firebase'
import { timestamp } from '../../utlis/timestamp'

function Banking() {

  const randomid = randomId().slice(8, 20)

  const [trans, setTrans] = React.useState({
    count: '',
    sale: '',
    opto: '',
    bank: '',
    operator: ''
  })

  const handleInput = e => {
    const { name, value} = e.target
    setTrans({...trans, [name]: value})
  }

  const buy = 1

  const valPrib = 1

  const createTransac = async () => {
    await addDoc(doc(db, 'transactions', randomid), {
      id: randomid,
      type: 'hande',
      createdAt: timestamp,
      count: trans.count,
      sale: trans.sale,
      buy: buy,
      valPrib: valPrib
    })
  }

  return (
    <div>
      <TextInput
        label='Количество'
        name='count'
        value={trans.count}
        onChange={handleInput}
      />
      <TextInput
        label='Продажа'
        name='sale'
        value={trans.sale}
        onChange={handleInput}
      />
      <TextInput
        label='Банк %'
        name='bank'
        value={trans.bank}
        onChange={handleInput}
      />
      <TextInput
        label='Opto %'
        name='opto'
        value={trans.opto}
        onChange={handleInput}
      />
      <TextInput
        label='Оператор %'
        name='operator'
        value={trans.operator}
        onChange={handleInput}
      />
      <p>
        <span>Покупка:</span>
        <span>{buy}</span>
      </p>
      <p>
        <span>Вал прибыль:</span>
        <span>{valPrib}</span>
      </p>
    </div>
  )
}

export default Banking