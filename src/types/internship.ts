export interface InternshipApplication {
  name: string;
  email: string;
  college: string;
  year: string;
  phone: string;
  linkedin?: string;
  track: 'product' | 'uiux' | 'design' | 'tech';
  motivation: string;
  answers: Record<string, string>;
}

export interface ApplicationProgress {
  step: 'details' | 'questionnaire';
  data?: any;
  track?: string;
  answers?: Record<string, string>;
}
