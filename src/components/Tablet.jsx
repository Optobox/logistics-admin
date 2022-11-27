import React from 'react'
import { Table, Select, TextInput, Modal, Button, Menu, Text, Pagination } from "@mantine/core"
import { ref } from "firebase/storage"
import { format } from "date-fns"
import { storage } from "../utlis/firebase"
import { getDownloadURL } from "firebase/storage"

import { cities, categories } from "../utlis/db"

import { BsFillHandThumbsUpFill, BsFillHandThumbsDownFill } from 'react-icons/bs'

const styles = {
  cell: 'flex flex-col gap-x-2',
  sort: 'w-min',
  cube: 'cursor-pointer select-none',
  tHead: '',
  tCell: ''
}


const Tablet = ({array, handleModal }) => {

  const [sorted, setSorted] = React.useState(array)
  
  const [sortOrder, setSortOrder] = React.useState({
    priority: null,
    type: null,
    count: null,
    cost: null,
    time: '',
    category: null,
    city: null
  })

  const sortByPriority = (name) => {
    // const q = [...array!].sort((e: any) => e.priority === "Средняя цена - высшее качество")
    // const z = [...array!].sort((e: any) => e.priority === "Низкая цена - хорошее качество")
    // const a = [...array!].sort((e: any) => !e.priority)
    // switch (name) {
    //   case "high":
    //     setSorted(q)
    //     setSortOrder({ ...sortOrder, priority: "high" })
    //     break
    //   case "low":
    //     setSorted(z)
    //     setSortOrder({ ...sortOrder, priority: "low" })
    //     break
    //   case "tender":
    //     setSorted(a)
    //     setSortOrder({ ...sortOrder, priority: "tender" })
    //     break
    //   default:
    //     setSorted(...array)
    //     setSortOrder({ ...sortOrder, priority: null })
    //     break
    // }
  }

  const sortByType = (name) => {
    // const a = [...array].sort(e => e.type === "Разнотипный товар")
    // const q = [...array].sort(e => e.type === "Однотипный товар")
    // switch (name) {
    //   case "one":
    //     setSorted(q)
    //     setSortOrder({ ...sortOrder, type: "one" })
    //     break
    //   case "more":
    //     setSorted(a)
    //     setSortOrder({ ...sortOrder, type: "more" })
    //     break
    //   default:
    //     setSorted(...array)
    //     setSortOrder({ ...sortOrder, type: "all" })
    //     break
    // }
  }

  const sortByCategory = (name) => {

  }

  const sortBySum = (name) => {
    // const w = [...array].sort((a, b) => a.cost - b.cost)
    // const q = [...array].sort((a, b) => b.cost - a.cost)
    // switch (name) {
    //   case "max":
    //     setSorted(q)
    //     setSortOrder({ ...sortOrder, cost: "max" })
    //     break
    //   case "min":
    //     setSorted(w)
    //     setSortOrder({ ...sortOrder, cost: "min" })
    //     break
    //   default:
    //     setSorted(...array)
    //     setSortOrder({ ...sortOrder, cost: "all" })
    //     break
    // }
  }

  const sortByCount = (name) => {
    // const q = [...array].sort((a, b) => { return b.count - a.count })
    // const w = [...array].sort((a, b) => { return a.count - b.count })
    // switch (name) {
    //   case "max":
    //     setSorted(q)
    //     setSortOrder({ ...sortOrder, count: "max" })
    //     break
    //   case "min":
    //     setSorted(w)
    //     setSortOrder({ ...sortOrder, count: "min" })
    //     break
    //   default:
    //     setSorted(...array)
    //     setSortOrder({ ...sortOrder, count: "all" })
    //     break
    // }
  }

  const sortCity = (e) => {
    // const q = [...sorted].sort(a => a.city?.toLowerCase().includes(e ?? ''.toLowerCase()))
    // setSorted(q)
  }
  const sortManagers = (e) => {
    // const q = [...sorted].sort(a => a.done_by?.name.toLowerCase().includes(e ?? ''.toLowerCase()))
    // setSorted(q)
  }


  // const filtered = sorted.sort((a, b) => {
  //   return parseInt(a.when?.slice(1)) - parseInt(b.when?.slice(1)) 
  // })

  // const filteredByCities = filtered.filter(e => {
  //   // if (!sortCity) return e
  //   // return e.city?.toLowerCase().includes(sortCity?.toLowerCase())
  // })

  // const filteredManagers = filteredByCities.filter(e => {
  //   // if (!sortManager) return e
  //   // return e.done_by?.name.toLowerCase().includes(sortManager?.toLowerCase())
  // })


  const [modal, setModal] = React.useState({
    file: '',
    opened: false
  })

  const click = (e, file) => {
    e.stopPropagation();
    // const storageRef = ref(storage, file)
    // getDownloadURL(storageRef)
    // .then(e => {
    //   setModal({ opened: true, file: e })
    // })
  }

  const formatter = new Intl.NumberFormat('kaz', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0
  })

  return (
    <>
      <Table className='font-body' verticalSpacing={"xs"} horizontalSpacing={"xs"}>
        <thead>
          <tr>
            <th>
              Создано
            </th>
            <th>
              <Menu classNames={{
                dropdown: 'max-h-96 overflow-scroll',
              }}>
                <Menu.Target>
                  <Button compact variant='light' className='-m-2'>
                    Категория:
                    {
                      ' все'
                    }
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={sortByPriority} >Все</Menu.Item>
                  {categories.map((e, i) => {
                    return <Menu.Item key={i} onClick={() => sortByCategory(e)}>{e}</Menu.Item>
                  })}
                </Menu.Dropdown>
              </Menu>
            </th>
            <th className={styles.cube} >
              <Menu>
                <Menu.Target>
                  <Button compact variant='light' className={`-m-2`}>
                    Приоритет:
                    {
                      (sortOrder.priority === null && " все") ||
                      (sortOrder.priority === "low" && " низкая цена") ||
                      (sortOrder.priority === "high" && " средняя цена") ||
                      (sortOrder.priority === "tender" && " тендер")
                    }
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={sortByPriority} >Все</Menu.Item>
                  <Menu.Item onClick={() => sortByPriority('low')} >Низкая цена - хорошее качество</Menu.Item>
                  <Menu.Item onClick={() => sortByPriority('high')} >Средняя цена - высшее качество</Menu.Item>
                  <Menu.Item onClick={() => sortByPriority('tender')} >Тендер</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </th>
            <th className={styles.cube} >
              <Menu>
                <Menu.Target>
                  <Button compact variant='light' className='-m-2'>
                    Вид товара:
                    {
                      (sortOrder.type === null && " все") ||
                      (sortOrder.type === "one" && " однотипный") ||
                      (sortOrder.type === "more" && " разнотипный")
                    }
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={sortByType} >Все</Menu.Item>
                  <Menu.Item onClick={() => sortByType('one')} >Однотипный</Menu.Item>
                  <Menu.Item onClick={() => sortByType('more')} >Разнотипный</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </th>
            <th className={styles.cube}>
              Описание
            </th>
            <th className={styles.cube}>
              <Menu>
                <Menu.Target>
                  <Button compact variant='light' className='-m-2'>
                    Общ ст (тг):
                    {
                      (sortOrder.cost === null && " все") ||
                      (sortOrder.cost === "max" && " больше") ||
                      (sortOrder.cost === "min" && " меньше")
                    }
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={sortBySum} >Все</Menu.Item>
                  <Menu.Item onClick={() => sortBySum('max')} >Больше</Menu.Item>
                  <Menu.Item onClick={() => sortBySum('min')} >Меньше</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </th>
            <th className={styles.cube}>
              <Menu>
                <Menu.Target>
                  <Button compact variant='light' className='-m-2'>
                    Общ колво (шт):
                    {
                      (sortOrder.count === null && " все") ||
                      (sortOrder.count === "max" && " больше") ||
                      (sortOrder.count === "min" && " меньше")
                    }
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>
                    Сортировка
                  </Menu.Label>
                  <Menu.Item onClick={sortByCount}>Все</Menu.Item>
                  <Menu.Item onClick={() => sortByCount('max')}>Больше</Menu.Item>
                  <Menu.Item onClick={() => sortByCount('min')}>Меньше</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </th>
            <th>
              <div className={styles.cell}>
                <Menu
                  classNames={{
                    dropdown: 'max-h-96 overflow-scroll',
                  }}
                >
                  <Menu.Target>
                    <Button compact variant='light' className='-m-2'>
                      Город:
                      {
                        ' все'
                      }
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={sortByCount}>Все</Menu.Item>
                    {cities.map((e, i) => {
                      return <Menu.Item key={i} onClick={() => sortCity(e)}>{e}</Menu.Item>
                    })}
                  </Menu.Dropdown>
                </Menu>
              </div>
            </th>
            <th className={styles.cube}>
              Имя
            </th>
            <th className={styles.cube}>
              Номер
            </th>
            <th>
              Время
            </th>
            <th>
              Дата изменения
            </th>
            {array?.some((obj) => obj.done_by) && (
              <>
                <th>
                  {/* <div className={styles.cell}> */}
                  Менеджер
                    {/* <TextInput onChange={sortManagers} /> */}
                  {/* </div> */}
                </th>
                <th>
                  Комментарий
                </th>
                <th>
                  Обновлено
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {array?.map((e, index) => {
            const createdAt = e.createdAt ? format(new Date(e.createdAt?.seconds * 1000), 'dd.MM.yy - k:mm') : " "
            const updatedAt = e.updatedAt ? format(new Date(e.updatedAt?.seconds * 1000), 'dd.MM.yy - k:mm',) : " "
            return (
              <tr key={index} className={`file:cursor-pointer ${styles.tCell}`}>
                <td>
                  {createdAt}
                </td>
                <td>
                  {e.category}
                </td>
                <td>
                  <Text lineClamp={1}>
                    {!e.priority &&
                      <>
                        <span>Тендер</span>
                        <span className='text-green-500 text-xl'>
                          <BsFillHandThumbsUpFill />
                        </span>
                      </>
                    }
                    {e.priority === "Низкая цена - хорошее качество" &&
                      <div className='flex justify-between'>
                        <span>
                          Низкая цена
                        </span>
                        <span className='text-red-500 text-xl'>
                          <BsFillHandThumbsDownFill />
                        </span>
                      </div>
                    }
                    {e.priority === "Средняя цена - высшее качество" &&
                      <div className='flex justify-between'>
                        <span>
                          Средняя цена
                        </span>
                        <span className='text-green-500 text-xl'>
                          <BsFillHandThumbsUpFill />
                        </span>
                      </div>
                    }
                  </Text>
                </td>
                <td>
                  {e.type === "Разнотипный товар" && "Разнотипный"}
                  {e.type === "Однотипный товар" && "Однотипный"}
                </td>
                <td className='max-w-xs'>
                  <div className={styles.cell}>
                    <Text lineClamp={1}>
                      {e.description}
                    </Text>
                    {e.special &&
                      <Button variant="subtle" compact onClick={(q) => click(q, e.special)} >
                        doc.pdf
                      </Button>
                    }
                  </div>
                </td>
                <td>{formatter.format(e.cost)?.slice(3)}</td>
                <td>{e.count}</td>
                <td>{e.city}</td>
                <td>
                  <Text lineClamp={1}>
                    {e.name}
                  </Text>
                </td>
                <td>
                  <span className="bg-green-200 mb-2 cursor-pointer block p-1 text-black">
                    {e.tel}
                  </span>
                </td>
                <td>
                  <Text>
                    {e.when?.slice(0, 1)} - {e.when?.slice(1)}
                  </Text>
                </td>
                <td>
                  {updatedAt}
                </td>
                {array?.some((obj) => obj.done_by) && (
                  <>
                    <td>
                      {e.done_by?.name}
                    </td>
                    <td>
                      {e.done_by?.comment}
                    </td>
                    <td>
                      {updatedAt}
                    </td>
                  </>
                )}
              </tr>
            )
          })}
          {/* {array.length === 0 && (
            <tr>
              <td>Ничего не найдено</td>
            </tr>
          )} */}
        </tbody>
      </Table>
      <div className='my-4 flex justify-center'>
        <Pagination total={1} withControls withEdges onChange={e => console.log(e)} />
      </div>
      <Modal
        opened={modal.opened}
        onClose={() => setModal({ ...modal, opened: false })}
        withCloseButton={false}
        centered
        size="lg"
        title="Предпросмотр"
        overflow="inside"
      >
        <div className="">
          <iframe src={modal?.file} height={600} width="100%" title="myFrame" >
          </iframe>
        </div>
      </Modal>
    </>
  )
}

export default Tablet