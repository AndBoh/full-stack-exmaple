import { Project } from '@/api/interfaces/Project';
import { Company } from '@/api/interfaces/Company';

export interface User {
  id: string,
  name: string,
}

export interface Me extends User {
  login: string;
  companies: Company[],
  projects: Project[];
}
