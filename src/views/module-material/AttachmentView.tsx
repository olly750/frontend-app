 
import React, { useState, useEffect } from "react";

import {
    Route,
    Switch,
    useHistory,
    useLocation,
    useParams,
    useRouteMatch,
  } from 'react-router-dom';
  import Button from '../../components/Atoms/custom/Button';
  import Heading from '../../components/Atoms/Text/Heading';
  import axios from "axios";
  import { ADMIN_BASE_URL } from '../../plugins/axios';
import cookie from '../../utils/cookie'; 
import toast from 'react-hot-toast';
import { moduleMaterialStore } from '../../store/administration/module-material.store'; 



 


function AttachmentView() {
  
    const { search } = useLocation(); 
    const attachments = new URLSearchParams(search).get('attachment') || '';

    const attachment = moduleMaterialStore.getFileById(attachments).data?.data
    .data;

  let filename = attachment?.path_to_file.replace(/^.*[\\/]/, '').slice(36) || '';

 

  const token = cookie.getCookie('jwt_info');
let tok = JSON.parse(token!);



const [urls, setUrl] =useState('');
 
  useEffect(() => {
    
    const fetch = async () => {
      const response = await axios(`${ADMIN_BASE_URL}/attachments/downloadByFilename/${attachment?.original_file_name}`,{
        headers: { Authorization: `Bearer ${tok.token}` },
        method: 'GET',
        responseType: 'blob' //Force to receive data in a Blob Format
    })
  .then(response => {
  //Create a Blob from the PDF Stream

      const file = new Blob(
        [response.data], 
        {type: 'application/pdf'}); 
 
  //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      setUrl(fileURL);
  //Open the URL on new Window
      // window.open(fileURL); 38223
  })
  .catch(error => {
      console.log(error);
  });

    };
    fetch();
  }, []);




 

    return (
        <div className="pt-3 w-5/5">
     <div className="flex justify-between items-center">
          <Heading fontSize="base" fontWeight="semibold">
           {filename}
          </Heading>
        </div>   
    <div onContextMenu={(e) => e.preventDefault()}>

    <embed
    src={urls}
    type="application/pdf"
    height={800}
    width= "100%"
  />
 
      </div>
    </div>
    );
  }
  
  export default AttachmentView;





