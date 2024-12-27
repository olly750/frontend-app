import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import getImages from '../../store/gallery/getimages';
import { IntakeProgParam } from '../../types/services/intake-program.types';
import ImagesGallery from './ImagesGallery';


export default function Gallery(props: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableData, setAvailableData] = useState(false);
  const { intakeProg } = useParams<IntakeProgParam>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getImages(intakeProg).then((res) => {
        return res;
      });
      response.length > 0 && setData(response);
      setLoading(false);
      response.length == 0 && setAvailableData(true);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps, no-undef
  }, []);
  return (
    <div style={{ marginTop: '20px' }}>
      {loading ? (
        <Loader />
      ) : availableData ? (
        <>
          <NoDataAvailable
            title={'No data available'}
            icon="user"
            description={'Please add some data first'}
            showButton={false}
          />
        </>
      ) : (
        <ImagesGallery
          galleryType={props.galleryType}
          setLoading={setLoading}
          setAvailableData={setAvailableData}
          images={
            props.galleryType === 'img'
              ? data.filter((item: any) => item.file_type.includes('image'))
              : data.filter((item: any) => item.file_type.includes('video'))
          }
        />
      )}
    </div>
  );
}
