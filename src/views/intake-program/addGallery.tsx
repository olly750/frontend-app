/* eslint-disable react/no-children-prop */
/* eslint no-use-before-define: 0 */ // --> OFF
/* eslint-disable-next-line */
import axios from 'axios';
import { ADMIN_BASE_URL } from '../../plugins/axios';
import toast from 'react-hot-toast';
import React, { useState, useRef } from 'react';
import Button from '../../components/Atoms/custom/Button';
import cookie from '../../utils/cookie';
export default function AddGallery(_props: any) {
  const [file, setFile] = useState<any>({});
  const inputRef = useRef<any>();
  const [button, setButton] = useState(true);
  const token = cookie.getCookie('jwt_info');
  let tok = JSON.parse(token || '');
  const handleUploadbtn = async () => {
    inputRef.current.click();
    setButton(false);
  };
  const { name } = file[0] || '';
  console.log(name);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButton(true);
    const formData = new FormData();
    formData.append('file', file[0]);
    axios({
      method: 'post',
      url: `${ADMIN_BASE_URL}/gallery/uploads/${_props.intakeProg}`,
      data: formData,
      headers: {
        Authorization: 'Bearer ' + tok.token,
      },
    })
      .then((res) => {
        toast.success(`Successfully uploaded file`, { duration: 5000 });
        console.log(res);
        setButton(true);
        setFile({});
      })
      .catch((res) => {
        console.log(res.error);
        setFile({});
        setButton(true);
        toast.error('Upload failed', { duration: 5000 });
      });
  };

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <h3>Upload Files </h3>
        <div className="form-group" style={{ padding: 10 }}>
          <input
            id="fileinput"
            type="file"
            ref={inputRef}
            onChange={(e) => setFile(e.target?.files!)}
            hidden
          />
          <Button
            type="button"
            style={{ cursor: !button ? 'not-allowed' : ' ' }}
            onClick={handleUploadbtn}
            disabled={!button}>
            CHOOSE FILES
          </Button>
          <p>{name}</p>
        </div>
        <Button
          style={{ cursor: button ? 'not-allowed' : ' ' }}
          styleType="outline"
          type="submit"
          disabled={button}>
          upload
        </Button>
      </form>
    </>
  );
}
