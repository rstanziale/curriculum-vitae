/**
 * Personal and contact information of the candidate
 */
export interface PersonalInfo {
  firstName: string;
  secondName?: string;
  surname: string;
  phone: string;
  email: string;
  linkedin?: string;
  github?: string;
}

/**
 * Localized labels for CV section headings
 */
export interface Labels {
  aboutMe: string;
  languages: string;
  skills: string;
  softSkills: string;
  hobbies: string;
  experience: string;
  certifications: string;
  education: string;
}

/**
 * A spoken language with proficiency level
 */
export interface Language {
  name: string;
  level: string;
}

/**
 * A highlight with title and description within a work experience
 */
export interface Highlight {
  title: string;
  description: string;
}

/**
 * A single work experience entry
 */
export interface WorkExperience {
  company: string;
  period: string;
  role: string;
  techStack: string[];
  highlights: Highlight[];
}

/**
 * Validity period of a certification
 */
export interface CertificationPeriod {
  from: string;
  to?: string;
}

/**
 * A single certification entry
 */
export interface Certification {
  title: string;
  period: CertificationPeriod;
}

/**
 * A single degree entry within education
 */
export interface Degree {
  level: string;
  thesisTitle: string;
}

/**
 * Academic background of the candidate
 */
export interface Education {
  institution: string;
  field: string;
  grade: string;
  maxGrade?: string;
  degrees: Degree[];
}

/**
 * Complete CV data structure for a single language
 */
export interface CvData {
  personalInfo: PersonalInfo;
  labels: Labels;
  aboutMe: string;
  languages: Language[];
  hardSkills: string[];
  softSkills: string[];
  hobbies: string[];
  workExperience: WorkExperience[];
  certifications: Certification[];
  education: Education;
  gdprConsent?: string;
}
