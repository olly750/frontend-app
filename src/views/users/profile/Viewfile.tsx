import axios from 'axios';

import React, { useEffect, useRef, useState } from 'react';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Button from '../../../components/Atoms/custom/Button';
import Icon from '../../../components/Atoms/custom/Icon';
import Heading from '../../../components/Atoms/Text/Heading';
import { ADMIN_BASE_URL } from '../../../plugins/axios';
import cookie from '../../../utils/cookie';
// import { Document, Page, pdfjs } from "react-pdf";
// import  "../../../styles/materialPDF.css";
//   pdfjs.GlobalWorkerOptions.workerSrc = `../../../../node_modules/pdf.worker.js`; 


 

function Viewfile() {
  const history = useHistory();
  const { search } = useLocation();
  const filename = new URLSearchParams(search).get('fl') || '';


  const canvasRef = useRef(null);

 

  const goBack = () => {
    history.goBack();
  };

  const token = cookie.getCookie('jwt_info');
  let tok = JSON.parse(token!);

   const [urls, setUrl] =useState('');
   const pdfsamplefile='../../../../public/Brochure.pdf';
   

    useEffect(() => {

      const fetch = async () => {
        const response = await axios(`${ADMIN_BASE_URL}/attachments/download/personalDocs/${filename}`,{
          headers: { Authorization: `Bearer ${tok.token}` },
          method: 'GET',
          responseType: 'blob'
      })
    .then(response => {
        const file = new Blob(
          [response.data],
          {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        setUrl(fileURL);

    })
    .catch(error => {
        console.log(error);
    });

      };
      fetch();
    }, []);

    console.log("data test",urls)

  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }:{numPages:any}) => {
    setNumPages(numPages);
  };

  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  }; 
  return (
    <div className="pt-3 w-5/5">
      <div className="flex justify-between items-center">
        <Heading fontSize="base" fontWeight="semibold">
          <div className="w-44">
            <button className="outline-none" onClick={goBack}>
              <Icon name={'back-arrow'} bgColor="gray" />
            </button>
          </div>
        </Heading>
      </div>
      <div onContextMenu={(e) => e.preventDefault()}>
        {/* <canvas ref={canvasRef} /> */}
     
  <embed
    src={urls}
    type="application/pdf"
    height={800}
    width= "100%"
  />

       {/* <Document
        file={urls}        
        onLoadSuccess={onDocumentLoadSuccess} 
        className="pdf-container" 
      >
        
        <Page   
        className="react-pdf__Page__canvas" 
        pageNumber={pageNumber} 
        renderTextLayer={false}
        renderAnnotationLayer={false} 
        />
      </Document>
      <div className="controls"><br/>
      <div className="flex gap-3">
                  <Button
                   onClick={prevPage} disabled={pageNumber === 1}>
                   Prev
                  </Button>
                  <Button
                   onClick={nextPage} disabled={pageNumber === numPages}>
                   Next
                  </Button>
                </div> 
      </div>   */}
      </div>
    </div>
  );
}

export default Viewfile;
