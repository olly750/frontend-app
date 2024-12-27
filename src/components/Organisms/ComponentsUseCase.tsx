import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../Atoms/custom/Button';
import Checkbox from '../Atoms/Input/CheckBox';
import DropDown from '../Atoms/Input/Dropdown';
import Input from '../Atoms/Input/Input';
import Select from '../Atoms/Input/Select';
import CheckboxMolecule from '../Molecules/input/CheckboxMolecule';
import DropdownMolecule from '../Molecules/input/DropdownMolecule';
import { Tab, Tabs } from '../Molecules/tabs/tabs';

export default function CreatedBySandberg() {
  const [checked, setChecked] = useState(false);
  const { t } = useTranslation();

  const options = [
    {
      label: 'English',
      value: 'en',
    },
    {
      label: 'French',
      value: 'fr',
    },
    {
      label: 'Kinyarwanda',
      value: 'kiny',
    },
  ];
  return (
    <>
      <div className="p-8">
        <h2 className="font-bold text-primary-500 text-2xl py-10">
          Created by Sandberg.
        </h2>
        <form className="py-10">
          <Select
            handleChange={(_e: object) => {
              console.log('called');
            }}
            placeholder="Choose language"
            name={'language'}
            required
            options={options}
          />
          <div className="pt-4">
            <Button type="submit">Submit</Button>
          </div>
        </form>
        <Checkbox
          name="language"
          value="en"
          checked={checked}
          label="English"
          handleChange={() => setChecked(!checked)}
        />
        <div className="py-3">
          <Checkbox
            name="language"
            value="en"
            checked={checked}
            label="French"
            handleChange={() => setChecked(!checked)}
          />
        </div>
        <Tabs className="my-4" activeIndex={1}>
          <Tab label="Students">
            <h1 className="text-3xl text-primary-500">Students</h1>
          </Tab>
          <Tab label="Instructors">
            <h2 className="text-3xl text-green-400">{t('Instructor')}</h2>
          </Tab>
          <Tab label="Admins" disabled={false}>
            <h2 className="text-3xl text-yellow-300 font-bold">Admins here</h2>
          </Tab>
        </Tabs>
        <CheckboxMolecule
          options={options}
          name="language"
          placeholder="Language"
          handleChange={() => console.log('changed')}
          values={[]}
        />
        <DropDown
          options={options}
          name="intakes"
          handleChange={(_e: object) => {}}
          defaultValue={options[1]}
        />
        <Input name="email" value="" handleChange={(_e) => {}} />
        <DropdownMolecule
          options={options}
          name="academy"
          handleChange={(_e: object) => {}}
          error="Please select academy"
          isMulti>
          Select academy
        </DropdownMolecule>
      </div>
    </>
  );
}
