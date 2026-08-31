/**
 * Personal information section of the CV
 */
export interface PersonalInfo {
  firstName: string;
  secondName?: string;
  surname: string;
  subtitle: string;
  phone: string;
  email: string;
  linkedin?: string;
  github?: string;
}

/**
 * Labels for CV sections (localized)
 */
export interface Labels {
  aboutMe: string;
  languages: string;
  skills: string;
  softSkills: string;
  hobbies: string;
}

/**
 * Language proficiency entry
 */
export interface Language {
  name: string;
  level: string;
}

/**
 * Complete CV data structure
 */
export interface CvData {
  personalInfo: PersonalInfo;
  labels: Labels;
  aboutMe: string;
  languages: Language[];
  hardSkills: string[];
  softSkills: string[];
  hobbies: string[];
}
