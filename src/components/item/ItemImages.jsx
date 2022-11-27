import { ActionIcon, Button, FileButton, NumberInput, TextInput } from '@mantine/core'
import Compressor from 'compressorjs'
import { doc, updateDoc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import React from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { PermissionContext } from '../../layout/Layout'
import { db, storage } from '../../utlis/firebase'
import { uploadAndGetImage } from '../../utlis/upload'
import { styles } from './ItemView'

function ItemImages({ item, handleImageView, saveItem, urls, setUrls }) {

  const { manager, service, admin, purchase } = React.useContext(PermissionContext)


  const addUrl = () => {
    setUrls([...urls, { link: '', cost: null, good: null, specs: null, extra: null }])
  }

  const  deleteFiles = async (name, index) => {
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
        return { ...e, [name]: val }
      } else {
        return e
      }
    })

    setUrls(newUrls)
  }

  return (
    <div>
      {((!service || manager) && (service || !manager)) && (
        
        <>
        {item?.urls?.map((e, i) => {
          return (
            <div className={styles.block} key={i}>
              <p className={styles.label}>Стоимость - {i + 1}</p>
              <p className={styles.value}>{e.cost} тг</p>
              {e?.specs && (
                <img src={e?.specs} alt="" className='w-24' onClick={() => handleImageView(e.specs)} />
              )}
              {e?.good && (
                <img src={e?.good} alt="" className='w-24' onClick={() => handleImageView(e.good)} />
              )}
              {e?.extra && (
                <img src={e?.extra} alt="" className='w-24' onClick={() => handleImageView(e.extra)} />
              )}
            </div>
          )
        })}
      {(item?.status === 'suggested' || item?.status === 'done') &&
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
                    <img src={e.specs} className='w-24' onClick={() => handleImageView(e.specs)} alt="" />
                  </p>
                )}
                {e?.good && (
                  <p className='flex items-center gap-4'>
                    <span className='font-semibold w-24'>Товар:</span>
                    <img src={e.good} className='w-24' onClick={() => handleImageView(e.good)} alt="" />
                  </p>
                )}
                {e?.extra && (
                  <p className='flex items-center gap-4'>
                    <span className='font-semibold w-24'>Доп:</span>
                    <img src={e.extra} className='w-24' onClick={() => handleImageView(e.extra)} alt="" />
                  </p>
                )}
              </div>
            )
          })}
        </>
      }
      {item?.status === 'adopted' && (
        <>
          {urls?.map((e, i) => {
            return (
              <React.Fragment key={i}>
                <div className='flex gap-4 items-center pr-6' key={i}>
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
                            className='w-24 h-24' 
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
                            className='w-24 h-24' 
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
                            className='w-24 h-24' 
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
   
        </>
      )}
      {item?.status === 'waiting' && (
        <div>
          <p className='text-lg font-semibold mb-2'>Требуемые данные:</p>
          <p>{item?.more_data}</p>
        </div>
      )}
        </>
      )}
    </div>
  )
}

export default ItemImages