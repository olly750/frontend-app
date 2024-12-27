import { Table } from '..';

export interface DiseasesTypes {
  description: string;
  name: string;
  id: string;
}

export interface PersonDiseaseTypes {
  diseases: DiseasesTypes[];
  person_id: string;
}

export interface DiseaseRes extends DiseasesTypes {
  // person_id: string;
}

export interface PersonDiseaseRes extends Table {
  disease: DiseasesTypes;
  person_id: string;
}
