import React from 'react'
import cn from 'classnames'
import { Menu } from '@mantine/core'

const styles = {
  cell: 'p-4 border flex gap-4 justify-between',
  label: 'font-semibold text-xl',
  value: 'font-semibold text-xl',
  def: 'text-sm tracking-wider',
}

function Cell({caption, values, className}) {

  const [array, setArray] = React.useState([])

  const filterValues = (val) => {
    switch(val) {
      case '30':
        setArray(
          array.filter(e => {
            return e.value.map(e => {
              e.createdAt?.seconds > (new Date().getTime() - 2592000) 
            })
          })
        );
      break
      case '7': 
      const q = [...array].map((value) => {
        return value.value
      })
      .filter(e => {
        console.log(e.createdAt?.seconds);
        return e.createdAt?.seconds 
        // > ((new Date().getTime() / 1000) - 86400) 
      })
      break
    }
  } 


  React.useEffect(() => {
    setArray(values ?? [])
  }, [values])

  const [filtered, setFiltered] = React.useState('30')

  return (
    <div 
      className={cn(className, styles.cell)}
    >
      <div>
        <h2 className={styles.label}>{caption}</h2>
        {array?.map((e, i) => {
          return (
            <div 
              key={i}
              className='flex items-end gap-4 mt-4'
            >
              <p className={styles.def}>{e?.label}</p>
              <p className={cn(styles.value, e?.className)}>
                {Array.isArray(e.value) ? e.value?.length : e.value}
              </p>
            </div>
          )
        })}
      </div>
      <div className='border p-2 h-min space-y-2 font-semibold text-lg px-4 cursor-pointer'>
        <Menu>
          <Menu.Target>
            <p>
              {filtered === '30' && '30 д.'}
              {filtered === '7' && '7 д.'}
              {filtered === '1' && '1 д.'}
              {filtered === 'all' && 'Все'}
            </p>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => filterValues('30')}>30 д.</Menu.Item>
            <Menu.Item onClick={() => filterValues('7')}>7 д.</Menu.Item>
            <Menu.Item onClick={() => filterValues('1')}>1 д.</Menu.Item>
            <Menu.Item onClick={() => filterValues('all')}>Все</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  )
}

export default Cell