import { addDoc, collection, query } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { db, storage } from '../../utlis/firebase'
import { showNotification } from '@mantine/notifications'
import { useDebouncedValue } from '@mantine/hooks'
import { Autocomplete, Button, Textarea, TextInput } from '@mantine/core'
import { DatePicker } from '@mantine/dates'

function Reviews() {

  const [values, loading, error] = useCollectionData(query(collection(db, 'reviews')))

  // const [item, setItem] = React.useState({
  //   title: '',
  //   image: null,
  //   description: '',
  //   city: '',
  //   when: null,
  // })
  // const [debounced] = useDebouncedValue(item, 500)

  // const [image, setImage] = React.useState < Blob | Uint8Array | ArrayBuffer | string | null>()

  // React.useEffect(() => {
  //   if (image) setItem({ ...item, image: URL.createObjectURL(image) })
  //   // eslint-disable-next-line
  // }, [image])

  // const metadata = {
  //   contentType: 'image/jpeg'
  // };

  // const [items, setItems] = React.useState([])
  // const [images, setImages] = React.useState([])

  // const addReview = async (e: any) => {
  //   e.preventDefault()
  //   if (!item.title && !item.description && !item.image) return
  //   const storageRef = ref(storage, 'images/' + image?.name);
  //   uploadBytesResumable(storageRef, image, metadata)
  //   await addDoc(collection(db, "reviews"), {
  //     title: item.title,
  //     image: `images/${image?.name}`,
  //     description: item.description,
  //     city: item.city,
  //     when: item.when,
  //   })
  //     .then(e => {
  //       showNotification({ title: "Отзыв", message: "Отзыв успешно добавлен!", color: 'green' })
  //       setItem({})
  //       setImage(null)
  //     })
  //     .catch(e => {
  //       showNotification({ title: "Отзыв", message: "Не удалось добавить отзыв", color: 'red' })
  //     })
  // }

  // React.useEffect(e => {
  //   const getReviews = async e => {
  //     const r = query(collection(db, "reviews"))
  //     const querySnapshot = await getDocs(r)
  //     setItems(querySnapshot.docs.map(e => { return e.data() }))
  //   }
  //   const getImages = async e => {
  //     for (let i = 0; i < items.length; i++) {
  //       const path = ref(storage, items?.[i]?.image)
  //       getDownloadURL(path)
  //         .then(e => {
  //           setImages([...images, e])
  //         })
  //         .catch(e => {
  //           console.log(e);
  //         })
  //     }
  //   }
  //   const fetchData = async () => {
  //     await getReviews()
  //     await getImages()
  //   }
  //   fetchData()
  //   return () => {
  //     // setImages([])
  //     // setItem({})
  //     // setItems([])
  //     // setImage({})
  //   }
  // }, [images, items]) 


  return (
    <div className='w-full pb-24'>
      <div>
        {/* <form onSubmit={addReview}>
          <div className="flex flex-col items-center mx-auto max-w-md">
            <div className="w-full">
              <TextInput
                value={item.title || ''}
                onChange={e => setItem({ ...item, title: e.target.value })}
                label="Заголовок"
              />
            </div>
            <div className="w-full">
              <Textarea
                value={item.description || ''}
                onChange={e => setItem({ ...item, description: e.target.value })}
                label="Описание"
                autosize
                minRows={3}
              />
            </div>
            <div className="w-full">
              <TextInput
                label="Изображение"
                type="file"
                onChange={e => setImage(e.target.files[0])}
              />
            </div>
            <div className="w-full">
              <Autocomplete
                data={cities}
                label="Город"
                onChange={e => setItem({ ...item, city: e })}
                placeholder="Введите город"
              />
            </div>
            <div className="w-full">
              <DatePicker
                label="Дата"
                onChange={e => setItem({ ...item, when: format(Date.parse(e), "dd/MM/yy") })}
              />
            </div>
            <div className="mt-4">
              <Button type="submit" >
                Добавить отзыв
              </Button>
            </div>
          </div>
        </form> */}
      </div>
    </div>
  )
}

export default Reviews