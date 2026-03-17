// Education API Types - matches backend education app serializers

export interface EducationCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  is_active: boolean;
}

export interface EducationAudience {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  landing_page_url: string;
  order: number;
  is_active: boolean;
}

export interface CategoryNameSlug {
  name: string;
  slug: string;
}

export interface AudienceNameSlug {
  name: string;
  slug: string;
}

// Course types
export interface CourseListItem {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  difficulty: string;
  format: string;
  duration_weeks: number;
  has_certificate: boolean;
  is_featured: boolean;
  next_cohort_date: string | null;
  featured_image: string | null;
  category: CategoryNameSlug;
  audiences: AudienceNameSlug[];
}

export interface CourseModule {
  id: number;
  title: string;
  description: string;
  order: number;
  duration_description: string;
}

export interface CourseFAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface InstructorInfo {
  id: number;
  name: string;
  slug: string;
  title: string;
  bio: string;
  short_bio: string;
  photo: string | null;
  linkedin_url: string;
  twitter_url: string;
}

export interface CourseDetail extends CourseListItem {
  subtitle: string;
  description: string;
  intro_video_url: string;
  status: string;
  hours_per_week: number;
  total_lessons: number;
  schedule_description: string;
  whats_included: string[];
  tools_mentioned: string[];
  certificate_description: string;
  language: string;
  has_hindi_support: boolean;
  meta_title: string;
  meta_description: string;
  rating: string;
  instructors: InstructorInfo[];
  modules: CourseModule[];
  faqs: CourseFAQ[];
  related_guides: GuideListItem[];
  created_at: string;
  updated_at: string;
}

// Guide types
export interface GuideListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  difficulty: string;
  read_time_minutes: number;
  is_featured: boolean;
  published_at: string | null;
  featured_image: string | null;
  category: CategoryNameSlug;
  audiences: AudienceNameSlug[];
}

export interface GuideDetail extends GuideListItem {
  subtitle: string;
  content: string;
  tools_mentioned: string[];
  meta_title: string;
  meta_description: string;
  author: {
    name: string;
    slug: string;
    title: string;
    short_bio: string;
    photo: string | null;
  } | null;
  related_course: {
    title: string;
    slug: string;
  } | null;
  created_at: string;
  updated_at: string;
}

// Workshop types
export interface WorkshopListItem {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  date: string;
  duration_minutes: number;
  format: string;
  status: string;
  instructor: string;
  is_featured: boolean;
}

export interface WorkshopDetail extends WorkshopListItem {
  description: string;
  timezone: string;
  platform: string;
  recording_url: string;
  max_participants: number;
  learning_outcomes: string[];
  prerequisites: string;
  category: CategoryNameSlug;
  audiences: AudienceNameSlug[];
  created_at: string;
  updated_at: string;
}

// Learning Path types
export interface LearningPathListItem {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  estimated_duration: string;
  audience: AudienceNameSlug | null;
  icon: string;
}

export interface LearningPathModule {
  id: number;
  title: string;
  description: string;
  order: number;
  courses: CourseListItem[];
  guides: GuideListItem[];
  workshops: WorkshopListItem[];
}

export interface LearningPathDetail extends LearningPathListItem {
  description: string;
  modules: LearningPathModule[];
  created_at: string;
  updated_at: string;
}

// Landing Page types
export interface LandingPage {
  id: number;
  page_type: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_url: string;
  hero_image: string | null;
  pitch_title: string;
  pitch_content: string;
  content_blocks: ContentBlock[];
  featured_courses: CourseListItem[];
  meta_title: string;
  meta_description: string;
  is_active: boolean;
}

export interface ContentBlock {
  title?: string;
  content?: string;
  type?: string;
  items?: string[];
  icon?: string;
}

// Form submission types
export interface CourseInquiryData {
  name: string;
  email: string;
  phone: string;
  city: string;
  current_role: string;
  message: string;
  course_slug?: string;
  source_page: string;
}

export interface OrganizationInquiryData {
  inquiry_type: 'college' | 'corporate';
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  city: string;
  estimated_batch_size: number | string;
  preferred_timeline: string;
  message: string;
}

export interface WorkshopRegistrationData {
  name: string;
  email: string;
  phone: string;
  organization: string;
}

export interface FormSuccessResponse {
  success: boolean;
  message: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
