import React from 'react';
import { Link } from 'react-router-dom';

// import { institutionStore } from '../../store/administration/institution.store';
import Button from '../Atoms/custom/Button';
import Icon from '../Atoms/custom/Icon';
import Heading from '../Atoms/Text/Heading';
// import AcademyProfileCard from './cards/AcademyProfileCard';
import Navigation from './navigation/Navbar';

type IHeader = {
  title?: string;
  details?: string;
  isSearching?: boolean;
};
const CompleteProfileHeader = ({
  title = 'Complete Profile',
  details = 'Fill in the form credentials to complete your profile',
  isSearching = false,
}: IHeader) => {
  // const institution = institutionStore.getAll();
  return (
    <div className="">
      {!isSearching ? <Navigation hasProfile={false} hasChangePassword={false} /> : null}

      <div className="md:px-24 md:py-7">
        <Heading fontSize="lg" className="md:2xl" fontWeight="semibold">
          {title}
        </Heading>
        <p className="text-txt-secondary text-sm md:text-base pt-2">{details}</p>
        <Button styleType="text">
          <Link to="/login" className="flex items-center justify-center mt-2">
            <Icon
              size={16}
              name="chevron-left"
              fill="primary"
              useheightandpadding={false}
            />{' '}
            Back to login
          </Link>
        </Button>
      </div>
    </div>
    /* <div>
        <AcademyProfileCard
          src="/images/rdf-logo.png"
          alt="institution logo"
          size="80"
          bgColor="none"
          txtSize="lg"
          fontWeight="semibold"
          color="primary"
          subtitle={institution.data?.data.data[0].moto}>
          {institution.data?.data.data[0].name}
        </AcademyProfileCard>
      </div> */
  );
};

export default CompleteProfileHeader;
