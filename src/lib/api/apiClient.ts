const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
  }
  return null;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };
    
    const csrfToken = getCookie('csrftoken');
    if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')) {
      headers['X-CSRFToken'] = csrfToken;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || response.statusText;
      
      if (response.status === 404) {
        return null;
      }
      
      throw new Error(`API Error: ${errorMessage}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.cause?.code === 'ECONNREFUSED') {
      console.warn('Backend server is not running. Please start it with: cd backend && python manage.py runserver');
      return [];
    }
    throw error;
  }
}

export const toolsAPI = {
  getAll: (params?: { category?: string; pricing?: string; pricing_type?: string; featured?: boolean; startup_friendly?: boolean; page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.pricing) query.append('pricing', params.pricing);
    if (params?.pricing_type) query.append('pricing_type', params.pricing_type);
    if (params?.featured) query.append('featured', 'true');
    if (params?.startup_friendly) query.append('startup_friendly', 'true');
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());
    return fetchAPI(`/api/tools/?${query.toString()}`);
  },
  getBySlug: (slug: string) => fetchAPI(`/api/tools/${slug}/`),
  search: (query: string) => 
    fetchAPI('/api/tools/search/', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
  create: (data: any) =>
    fetchAPI('/api/tools/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (slug: string, data: any) =>
    fetchAPI(`/api/tools/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (slug: string) =>
    fetchAPI(`/api/tools/${slug}/`, {
      method: 'DELETE',
    }),
};

export const reviewsAPI = {
  getByToolId: (toolId: number) => 
    fetchAPI(`/api/reviews/?tool_id=${toolId}`),
  create: (data: any) =>
    fetchAPI('/api/reviews/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const dealsAPI = {
  getAll: () => fetchAPI('/api/deals/'),
};

export const newsAPI = {
  getAll: () => fetchAPI('/api/news/'),
  getBySlug: (slug: string) => fetchAPI(`/api/news/${slug}/`),
  upvote: (newsId: number, sessionId?: string) =>
    fetchAPI(`/api/news/${newsId}/upvote/`, {
      method: 'POST',
      headers: sessionId ? { 'X-Session-ID': sessionId } : {},
    }),
  removeUpvote: (newsId: number, sessionId?: string) =>
    fetchAPI(`/api/news/${newsId}/upvote/remove/`, {
      method: 'DELETE',
      headers: sessionId ? { 'X-Session-ID': sessionId } : {},
    }),
};

export const newsletterAPI = {
  subscribe: (email: string, source: string = 'homepage') =>
    fetchAPI('/api/newsletter/subscribe/', {
      method: 'POST',
      body: JSON.stringify({ email, source }),
    }),
};

export const categoriesAPI = {
  getAll: () => fetchAPI('/api/categories/'),
};

export const submissionAPI = {
  getAll: () => fetchAPI('/api/submissions/'),
  submit: (data: any) =>
    fetchAPI('/api/submissions/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const healthAPI = {
  check: () => fetchAPI('/api/health/'),
};

export const guidesAPI = {
  getAll: (params?: { difficulty?: string; category?: string; audience?: string; pricing?: string; featured?: boolean; tool?: string; page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.category) query.append('category', params.category);
    if (params?.audience) query.append('audience', params.audience);
    if (params?.pricing) query.append('pricing', params.pricing);
    if (params?.featured) query.append('featured', 'true');
    if (params?.tool) query.append('tool', params.tool);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());
    return fetchAPI(`/api/guides/?${query.toString()}`);
  },
  getBySlug: (slug: string) => fetchAPI(`/api/guides/${slug}/`),
  getFilters: () => fetchAPI('/api/guides/filters/'),
};

export const labsAPI = {
  getAll: (params?: { difficulty?: string; category?: string; audience?: string; pricing?: string; featured?: boolean; tool?: string; page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.category) query.append('category', params.category);
    if (params?.audience) query.append('audience', params.audience);
    if (params?.pricing) query.append('pricing', params.pricing);
    if (params?.featured) query.append('featured', 'true');
    if (params?.tool) query.append('tool', params.tool);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());
    return fetchAPI(`/api/labs/?${query.toString()}`);
  },
  getBySlug: (slug: string) => fetchAPI(`/api/labs/${slug}/`),
  getFilters: () => fetchAPI('/api/labs/filters/'),
};

export const workshopsAPI = {
  getAll: (params?: { difficulty?: string; category?: string; audience?: string; pricing?: string; featured?: boolean; tool?: string; page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.category) query.append('category', params.category);
    if (params?.audience) query.append('audience', params.audience);
    if (params?.pricing) query.append('pricing', params.pricing);
    if (params?.featured) query.append('featured', 'true');
    if (params?.tool) query.append('tool', params.tool);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());
    return fetchAPI(`/api/workshops/?${query.toString()}`);
  },
  getBySlug: (slug: string) => fetchAPI(`/api/workshops/${slug}/`),
  getFilters: () => fetchAPI('/api/workshops/filters/'),
};

// Education API - matches backend education app endpoints
export const educationAPI = {
  getCategories: () => fetchAPI('/api/education/categories/'),
  getAudiences: () => fetchAPI('/api/education/audiences/'),
  getCourses: (params?: { category?: string; audience?: string; difficulty?: string; format?: string; is_featured?: boolean; page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.audience) query.append('audience', params.audience);
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.format) query.append('format', params.format);
    if (params?.is_featured) query.append('is_featured', 'true');
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());
    return fetchAPI(`/api/education/courses/?${query.toString()}`);
  },
  getCourseBySlug: (slug: string) => fetchAPI(`/api/education/courses/${slug}/`),
  getGuides: (params?: { category?: string; audience?: string; difficulty?: string; is_featured?: boolean; page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.audience) query.append('audience', params.audience);
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.is_featured) query.append('is_featured', 'true');
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());
    return fetchAPI(`/api/education/guides/?${query.toString()}`);
  },
  getGuideBySlug: (slug: string) => fetchAPI(`/api/education/guides/${slug}/`),
  getWorkshops: (params?: { format?: string; status?: string; category?: string; page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.format) query.append('format', params.format);
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());
    return fetchAPI(`/api/education/workshops/?${query.toString()}`);
  },
  getWorkshopBySlug: (slug: string) => fetchAPI(`/api/education/workshops/${slug}/`),
  getLearningPaths: () => fetchAPI('/api/education/learning-paths/'),
  getLearningPathBySlug: (slug: string) => fetchAPI(`/api/education/learning-paths/${slug}/`),
  getLandingPage: (pageType: string) => fetchAPI(`/api/education/landing-pages/${pageType}/`),
  submitCourseInquiry: (data: Record<string, unknown>) =>
    fetchAPI('/api/education/inquiries/course/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  submitOrgInquiry: (data: Record<string, unknown>) =>
    fetchAPI('/api/education/inquiries/organization/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  registerForWorkshop: (slug: string, data: Record<string, unknown>) =>
    fetchAPI(`/api/education/workshops/${slug}/register/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const trackingAPI = {
  trackUsage: (toolId: number, sessionId?: string) =>
    fetchAPI('/track/usage/', {
      method: 'POST',
      body: JSON.stringify({ tool_id: toolId, session_id: sessionId || '' }),
    }),
  trackClick: (toolId: number, action: string, sessionId?: string, referrer?: string) =>
    fetchAPI('/track/click/', {
      method: 'POST',
      body: JSON.stringify({
        tool_id: toolId,
        action,
        session_id: sessionId || '',
        referrer: referrer || '',
      }),
    }),
  trackSearch: (query: string, resultsCount: number, filters?: Record<string, any>, sessionId?: string) =>
    fetchAPI('/track/search/', {
      method: 'POST',
      body: JSON.stringify({
        query,
        results_count: resultsCount,
        filters: filters || {},
        session_id: sessionId || '',
      }),
    }),
  getUsageCount: (toolId: number) => fetchAPI(`/tools/${toolId}/usage-count/`),
  getTrendingTools: (days?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (days) params.append('days', days.toString());
    if (limit) params.append('limit', limit.toString());
    return fetchAPI(`/tools/trending/?${params.toString()}`);
  },
};
