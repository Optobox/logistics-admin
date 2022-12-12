import React from 'react'
import { ActionIcon, Button, Checkbox, FileButton, Modal, NumberInput, TextInput } from '@mantine/core'
import Compressor from 'compressorjs'
import { doc, updateDoc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { useRouter } from 'next/router'
import { AiFillDelete } from 'react-icons/ai'
import { PermissionContext } from '../../layout/Layout'
import { db, storage } from '../../utlis/firebase'
import { uploadAndGetImage } from '../../utlis/upload'
import { ItemContext, styles } from './ItemView'

import cn from 'classnames'

function ItemImages({ item, setItem, saveItem, urls, setUrls, sendItem, confirmModal }) {

  const { manager, service, admin, purchase } = React.useContext(PermissionContext)
  const { suggested, adopted, done } = React.useContext(ItemContext)

  const addUrl = () => {
    setUrls([...urls, { 
      link: '', 
      cost: null, 
      good: null, 
      specs: null, 
      extra: null 
    }])
  }

  const deleteFiles = async (name, index) => {
    await deleteObject(ref(storage, `items/${item?.id}/${name}-${index}`)) 
    .then(async () => {
      const newUrls = urls.map((e, i) => {
        if (i === index) {
          return { ...e, [name]: null}
        } else {
          return e
        }
      })
      await updateDoc(doc(db, 'items', item?.id), {
        urls: newUrls
      })
      .then(() => {
        setUrls(newUrls)
      })
    })
  }

  const deleteUrl = (i) => {
    setUrls(q => q.filter((_, index) => {
      return index !== i
    })
    )
  }

  const handleUrlChange = async (val, name, index) => {
    if (name === 'specs' || name === 'good' || name === 'extra') {
      const files = urls.map((e, i) => {
        if (i === index) {
          return { ...e, [name]: val }
        } else {
          return e
        }
      })
      new Compressor(val, {
        quality: 0.6,
        async success(file) {
          await uploadAndGetImage(`items/${item?.id}/${name}-${index}`, file)
          .then((async e => {
            if (name === 'specs') {
              files[index].specs = e
            } 
            if (name === 'good') {
              files[index].good = e
            } 
            if (name === 'extra') {
              files[index].extra = e
            } 
            setUrls(files)
            await updateDoc(doc(db, 'items', item?.id), {
              urls: files
            })
          }))
        } 
      })
      return  
    }

    const newUrls = urls.map((e, i) => {
      if (i === index) {
        return { ...e, [name]: val}
      } else {
        return e
      }
    })

    setUrls(newUrls)
  }

  const router = useRouter()

  const [isOrder] = React.useState(router.pathname.includes('/orders'))

  const [modal, setModal] = React.useState({
    value: false, 
    src: null
  })

  const handleImageView = (url) => {
    setModal({value: true, src: url})
  }

  const selectUrls = (val, index) => {
    const newUrls = item?.urls?.map((e, i) => {
      if (i === index) {
        return { ...e, selected: val}
      } else {
        return e
      }
    })

    setItem({...item, urls: newUrls})
  }

  return (
    <>
      <div className='px-4 pr-8'>
        {isOrder ? (
          (!service || manager) && (service || !manager)) && (
            <>
              {(suggested || done) &&
                <>
                  {item?.urls?.map((e, i) => {
                    return (
                      <div key={i}>
                      <p className='flex items-center gap-4'>
                          <span className='font-semibold w-24'>Ссылка:</span>
                          {e.link}
                        </p>
                        <p className='flex items-center gap-4'>
                          <span className='font-semibold w-24'>Стоимость:</span>
                          {e.cost} тг
                        </p>
                        {e?.specs && (
                          <p className='flex items-center gap-4'>
                            <span className='font-semibold w-24'>Характеристика:</span>
                            <img 
                              src={e.specs} 
                              className='w-24' 
                              onClick={() => handleImageView(e.specs)} 
                              alt="" 
                            />
                          </p>
                        )}
                        {e?.good && (
                          <p className='flex items-center gap-4'>
                            <span className='font-semibold w-24'>Товар:</span>
                            <img 
                              src={e.good} 
                              className='w-24' 
                              onClick={() => handleImageView(e.good)} 
                              alt="" 
                            />
                          </p>
                        )}
                        {e?.extra && (
                          <p className='flex items-center gap-4'>
                            <span className='font-semibold w-24'>Доп:</span>
                            <img 
                              src={e.extra} 
                              className='w-24' 
                              onClick={() => handleImageView(e.extra)} 
                              alt="" 
                            />
                          </p>
                        )}
                      </div>
                    )
                  })}
                </>}
              {adopted && (
                <>
                  {urls?.map((e, i) => {
                    return (
                      <React.Fragment key={i}>
                        <div className='flex gap-4 items-center' key={i}>
                          <TextInput
                            className='w-full'
                            value={e.link ?? ''}
                            onChange={(v) => handleUrlChange(v.target.value, 'link', i)}
                            name='link'
                          />
                          <NumberInput
                            className='w-72'
                            value={e.cost}
                            onChange={(v) => handleUrlChange(v, 'cost', i)}
                            name='cost'
                            decimalSeparator='.'
                          />
                          {i >= 1 && (
                            <ActionIcon
                              color={'red'}
                              variant='subtle'
                              className='-mr-8 -ml-3'
                              onClick={() => deleteUrl(i)}
                            >
                              <AiFillDelete />
                            </ActionIcon>
                          )}
                        </div>
                        <div className='flex justify-between'>
                          <div>
                            {urls?.[i]?.specs && (
                              <div className='flex items-center'>
                                <img 
                                  src={urls[i].specs} 
                                  alt="" 
                                  className='w-16 h-16' 
                                  onClick={() => handleImageView(e.specs)} 
                                />
                                <Button 
                                  compact 
                                  color={'red'} 
                                  variant={'subtle'} 
                                  onClick={() => deleteFiles('specs', i)}
                                >
                                  удалить
                                </Button>
                              </div>
                            )}
                            <FileButton 
                              onChange={(e) => handleUrlChange(e, 'specs', i)} 
                              compact 
                              variant='subtle'
                            >
                              {(props) => <Button {...props}>добавить</Button>}
                            </FileButton>
                          </div>
                          <div>
                            {urls?.[i]?.good && (
                              <div className='flex items-center'>
                                <img 
                                  src={urls[i].good} 
                                  alt=""  
                                  className='w-16 h-16' 
                                  onClick={() => handleImageView(e.good)}
                                />
                                <Button 
                                  compact 
                                  color={'red'} 
                                  variant={'subtle'} 
                                  onClick={() => deleteFiles('good', i)}
                                >
                                  удалить
                                </Button>
                              </div>
                            )}
                            <FileButton 
                              onChange={(e) => handleUrlChange(e, 'good', i)} 
                              compact 
                              variant='subtle'
                            >
                              {(props) => <Button {...props}>добавить</Button>}
                            </FileButton>
                          </div>
                          <div>
                            {urls?.[i]?.extra && (
                              <div className='flex items-center'>
                                <img 
                                  src={urls[i].extra} 
                                  alt=""  
                                  className='w-16 h-16' 
                                  onClick={() => handleImageView(e.extra)}
                                />
                                <Button 
                                  compact 
                                  color={'red'} 
                                  variant={'subtle'} 
                                  onClick={() => deleteFiles('extra', i)}
                                >
                                  удалить
                                </Button>
                              </div>
                            )}
                            <FileButton 
                              onChange={(e) => handleUrlChange(e, 'extra', i)} 
                              compact 
                              variant='subtle'
                            >
                              {(props) => <Button {...props}>добавить</Button>}
                            </FileButton>
                          </div>
                        </div>
                      </React.Fragment>
                    )
                  })}
                  <div className='flex justify-between gap-4'>
                    <Button variant='subtle' compact onClick={addUrl}>
                      Добавить еще
                    </Button>
                    <Button onClick={saveItem}>
                      Сохранить
                    </Button>
                  </div>
                  <Button
                    color={'green'}
                    className='mt-4 mb-6'
                    onClick={() => confirmModal('Вы действительно хотите отправить заявку?', 'suggested', 'Отправить', sendItem)}
                  >
                    Отправить
                  </Button>
                </>
              )}
            </>
          )
          :
          <>
            {(suggested || done) && (
              <>
                {urls?.map((e, i) => {

                  const disabled = urls?.some((q, index) => q?.selected === true && index !== i)

                  return (
                    <div 
                      key={i}
                      className={cn('flex gap-4 p-4 transition-all duration-150 rounded-lg', {
                        'bg-slate-100': urls?.[i]?.selected
                      })}
                    >
                      <div>
                       <p className='mb-4 font-semibold ml-1'>{i + 1}</p>
                       {suggested && (
                        <Checkbox
                          width={50}
                          checked={urls?.[i]?.selected ?? false}
                          onChange={(v) => selectUrls(v.currentTarget.checked, i)}
                          disabled={disabled}
                        />
                       )}
                      </div>
                      <div className={`${styles.block} w-full`}>
                        <div className='flex gap-4'>
                          {e?.specs && (
                            <img 
                              src={e?.specs} 
                              alt="" className='w-24' 
                              onClick={() => handleImageView(e.specs)} 
                            />
                          )}
                          {e?.good && (
                            <img 
                              src={e?.good} 
                              alt="" className='w-24' 
                              onClick={() => handleImageView(e.good)} 
                            />
                          )}
                          {e?.extra && (
                            <img 
                              src={e?.extra} 
                              alt="" className='w-24' 
                              onClick={() => handleImageView(e.extra)} 
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </> 
            )}
          </>
        }
      </div>
      <Modal
        opened={modal.value}
        onClose={() => setModal({...modal, value: false})}
        centered
        withCloseButton={false}
      >
        <img src={modal?.src} alt="" />
      </Modal>
    </>
  )
}

export default ItemImages