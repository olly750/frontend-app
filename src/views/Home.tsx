import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../components/Atoms/custom/Button';
import StudentsSvg from '../components/Atoms/custom/StudentsSvg';
import Heading from '../components/Atoms/Text/Heading';
function Home() {
  return (
    <>
      <div className="grid lg:grid-cols-2 h-screen grid-cols-1 bg-main">
        <div className="flex flex-col px-5 py-8 md:rounded-md lg:p-20 justify-center">
          <Heading fontWeight="bold" fontSize="4xl">
            E-Learning management system
          </Heading>
          <div className="pt-14">
            <Heading color="primary">Improve your skills</Heading>
            <div className="flex flex-col gap-2 font-medium pt-5 pb-12">
              <p>
                Gives flexiblility to its users by delivering content to teams and
                individuals on-demand to their preferred devices, anytime, anywhere.
              </p>
              <p>
                The interactive access increases proficiency and allows learners to
                revisit information, and track their progress.
              </p>
            </div>
            <Link to="/login">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
        <div className="items-center justify-center hidden lg:flex bg-secondary">
          <StudentsSvg className="block w-5/6" />
        </div>
      </div>
    </>
  );
}

export default Home;
