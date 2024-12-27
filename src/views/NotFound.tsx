import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '../components/Atoms/custom/Button';

const NotFound = () => {
  const history = useHistory();

  function goTohome() {
    try {
      history.goBack();
    } catch (error) {
      history.push('/dashboard');
    }
  }

  return (
    <div className="w-full h-screen flex items-center">
      <div className="w-full md:w-10/12 lg:w-7/12 mx-auto px-6">
        <div className="flex flex-wrap">
          <h1 className="text-center xl:text-left text-primary-500 font-bold text-5xl xl:text-7xl px-5">
            404
          </h1>
          <div>
            <div className="md:border-l-2 px-5">
              <h4 className="font-black text-3xl md:text-4xl xl:text-6xl">
                Page not found
              </h4>
              <p className="text-sm lg:text-base text-gray-400 font-medium text-center py-3">
                Please check the URL in the address bar and try again.
              </p>
            </div>
            <div className="py-10 px-5 flex flex-wrap gap-3">
              <Button onClick={() => goTohome()}>Go back</Button>
              <Button styleType="outline" onClick={() => history.push('/')}>
                Contact support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
