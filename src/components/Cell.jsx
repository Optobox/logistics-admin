import React from 'react'

const styles = {
  cell: 'p-4 border',
  label: 'font-semibold text-xl',
  value: 'font-semibold text-2xl',
  def: 'text-sm tracking-wider',
}

function Cell({label, value, def}) {
  return (
    <div className={styles.cell}>
      <h2 className={styles.label}>{label}</h2>
      <div>
        <p className={styles.value}>{value}</p>
        <p className={styles.def}>{def}</p>
      </div>
    </div>
  )
}

export default Cell