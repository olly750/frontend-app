import 'react-html5video/dist/styles.css';

import React, { useCallback, useEffect, useState } from 'react';
import { Gallery } from 'react-grid-gallery';
import toast from 'react-hot-toast';
import { DefaultPlayer as Video } from 'react-html5video';

import Button from '../../components/Atoms/custom/Button';
import usePickedRole from '../../hooks/usePickedRole';
import deleteImage from '../../store/gallery/delete';
import fetchImages from '../../store/gallery/images';
import { Privileges } from '../../types';

function ImagesGallery(props: any) {
  const [imgData, setImgData] = useState<any>([]);
  const [vid, setVid] = useState<any>([]);
  const [lightBoxImg, setLightBoxImg] = useState('');
  const [lightbox, setLightbox] = useState(false);
  const [deleteItem, setDelete] = useState<any>();

  const picked_role = usePickedRole();

  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);
  // console.log(props);
  const handleRemove = useCallback(async (id: any) => {
    const res = await deleteImage(id);
    toast.success(`Successfully deleted`, { duration: 5000 });
    // console.log(res);
    return res;
  }, []);
  useEffect(() => {
    props.images.length === 0 && props.setAvailableData(true);

    props.images.map(async (img: any) => {
      props.setLoading(true);
      const data =
        img.file_type.includes('image') && (await fetchImages(img.file_name, img.id));
      const vidData =
        img.file_type.includes('video') && (await fetchImages(img.file_name, img.id));
      setImgData((prev: any) => {
        return [...prev, { src: data.src, filename: data.file_name, id: data.id }];
      });
      setVid((prev: any) => {
        return [
          ...prev,
          { src: vidData.src, filename: vidData.file_name, id: vidData.id },
        ];
      });
    });
    props.setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(vid);
  console.log(props);

  useEffect(() => {
    document.removeEventListener('click', () => {
      // console.log('removed');
    });
  }, [lightBoxImg]);
  // console.log(imgData);
  const handleClick = (_image: number) => {
    setLightbox(true);
    setLightBoxImg(imgData[_image].src);
    // console.log();
  };
  document.addEventListener('click', (e: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    if (e.target.tagName !== 'IMG') {
      setLightBoxImg('');
      setLightbox(false);
    }
  });
  const handleDelete = () => { 
    // console.log(deleteItem);
    if (deleteItem !== undefined) {
      handleRemove(imgData[deleteItem].id);
      const filteredData = imgData.filter(
        (item: any) => item.id !== imgData[deleteItem].id,
      );
      filteredData.length === 0 && props.setAvailableData(true);
      setImgData(filteredData);
    }

    // handleRemove(index);
  };
  const hasSelected = imgData.some((image: any) => image.isSelected);
  // console.log(hasSelected);

  const handleSelect = (index: number) => {
    const nextImages = imgData.map((image: any, i: any) =>
      i === index ? { ...image, isSelected: !image.isSelected } : image,
    );
    setImgData(nextImages);
    // console.log(nextImages);
    setDelete(index);
  };
  console.log("attachment",imgData)
  const deleteVid = (id: any) => {
    handleRemove(id);
    const filteredData = vid.filter((item: any) => item.id !== id);
    filteredData.length === 0 && props.setAvailableData(true);

    setVid(filteredData);
  };
  if (props.galleryType === 'img') {
    return (
      <>
        {lightbox && (
          <div
            style={{
              top: 0,
              position: 'fixed',
              zIndex: 100000,
              backgroundColor: ' rgba(0, 0, 0, 80%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className={`lightBox`}>
            <img
              src={lightBoxImg}
              alt=""
              style={{
                padding: '4px',
                backgroundColor: 'black',
                border: '2px solid white',
                maxWidth: '100%',
                maxHeight: '90%',
                marginRight: '200px',
              }}
            />
          </div>
        )}
        {hasPrivilege(Privileges.DELETE_INTAKE_PROGRAM_GALLERY) && hasSelected && (
          <Button style={{ color: 'black' }} color="error" onClick={() => handleDelete()}>
            Delete
          </Button>
        )}

        <Gallery
          enableImageSelection={true}
          onSelect={handleSelect}
          images={imgData}
          rowHeight={300}
          margin={6}
          onClick={(image) => handleClick(image)}
        />
      </>
    );
  } else
    return (
      <>
        {/* {vid.length < 0 && (
          <NoDataAvailable
            title={'No data available'}
            icon="user"
            description={'Please add some data first'}
            showButton={false}
          />
        )} */}
        <div
          className="vidcontainer"
          style={{
            display: 'grid',
            gap: 20,
            // gridAutoFlow: 'column',
            gridTemplateColumns: 'repeat(3,2fr)',
          }}>
          {props.setLoading(true)}
          {vid.map((item: any) => {
            return (
              <div key={item.src} style={{ marginBottom: '30px' }}>
                {/* {props.setLoading(true)} */}
                <Video autoplay loop>
                  <source src={item.src} />
                </Video>
                {hasPrivilege(Privileges.DELETE_INTAKE_PROGRAM_GALLERY) && (
                  <Button
                    style={{ color: 'black', marginTop: '20px' }}
                    color="error"
                    onClick={() => deleteVid(item.id)}>
                    Click to delete
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        {props.setLoading(false)}
      </>
    );
}
export default ImagesGallery;
