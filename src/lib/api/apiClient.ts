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
      const method = (options.method || 'GET').toUpperCase();

      if (response.status === 404 && method === 'GET') {
        return null;
      }
      
      throw new Error(`API Error: ${errorMessage}`);
    }

    if (response.status === 204) {
      return null;
    } 
    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.cause?.code === 'ECONNREFUSED') {
      console.warn('Backend server is not running. Please start it with: cd backend && python manage.py runserver');
      return [];
    }
    // During build / SSR, errors on GET requests should not crash page generation.
    // Mutations (POST/PUT/DELETE) always re-throw so server actions handle errors.
    const method = (options.method || 'GET').toUpperCase();
    if (typeof window === 'undefined' && method === 'GET') {
      console.error(`API fetch failed for ${endpoint}:`, error.message);
      return null;
    }
    throw error;
  }
}

export const toolsAPI = {
  getAll: (params?: { category?: string; pricing?: string; pricing_type?: string; featured?: boolean; startup_friendly?: boolean; page?: number; page_size?: number; ordering?: string; track?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.pricing) query.append('pricing', params.pricing);
    if (params?.pricing_type) query.append('pricing_type', params.pricing_type);
    if (params?.featured) query.append('featured', 'true');
    if (params?.startup_friendly) query.append('startup_friendly', 'true');
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());
    if (params?.ordering) query.append('ordering', params.ordering);
    if (params?.track) query.append('track', params.track);
    return fetchAPI(`/tools/?${query.toString()}`);
  },
  getStats: () => fetchAPI('/tools/stats/'),
  getBySlug: (slug: string) => fetchAPI(`/tools/${slug}/`),
  search: (query: string) => 
    fetchAPI('/tools/search/', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
  create: (data: any, extraHeaders?: Record<string, string>) =>
    fetchAPI('/tools/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: extraHeaders,
    }),
  update: (slug: string, data: any, extraHeaders?: Record<string, string>) =>
    fetchAPI(`/tools/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: extraHeaders,
    }),
  delete: (slug: string, extraHeaders?: Record<string, string>) =>
    fetchAPI(`/tools/${slug}/`, {
      method: 'DELETE',
      headers: extraHeaders,
    }),
  smartSearch: (query: string) =>
    fetchAPI('/tools/smart-search/', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
  decomposeSearch: (query: string) =>
    fetchAPI('/tools/decompose-search/', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
};

export const reviewsAPI = {
  getByToolId: (toolId: number) => 
    fetchAPI(`/reviews/?tool_id=${toolId}`),
  create: (data: any) =>
    fetchAPI('/reviews/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const dealsAPI = {
  getAll: () => fetchAPI('/deals/'),
};

export const newsAPI = {
  getAll: () => fetchAPI('/news/'),
  getBySlug: (slug: string) => fetchAPI(`/news/${slug}/`),
  upvote: (newsId: number, sessionId?: string) =>
    fetchAPI(`/news/${newsId}/upvote/`, {
      method: 'POST',
      headers: sessionId ? { 'X-Session-ID': sessionId } : {},
    }),
  removeUpvote: (newsId: number, sessionId?: string) =>
    fetchAPI(`/news/${newsId}/upvote/remove/`, {
      method: 'DELETE',
      headers: sessionId ? { 'X-Session-ID': sessionId } : {},
    }),
};

export const newsletterAPI = {
  subscribe: (email: string, source: string = 'homepage') =>
    fetchAPI('/newsletter/subscribe/', {
      method: 'POST',
      body: JSON.stringify({ email, source }),
    }),
};

export const categoriesAPI = {
  getAll: () => fetchAPI('/categories/'),
};

export const submissionAPI = {
  getAll: () => fetchAPI('/submissions/'),
  submit: (data: any) =>
    fetchAPI('/submissions/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const healthAPI = {
  check: () => fetchAPI('/health/'),
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
    return fetchAPI(`/guides/?${query.toString()}`);
  },
  getBySlug: (slug: string) => fetchAPI(`/guides/${slug}/`),
  getFilters: () => fetchAPI('/guides/filters/'),
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
    return fetchAPI(`/labs/?${query.toString()}`);
  },
  getBySlug: (slug: string) => fetchAPI(`/labs/${slug}/`),
  getFilters: () => fetchAPI('/labs/filters/'),
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
    return fetchAPI(`/workshops/?${query.toString()}`);
  },
  getBySlug: (slug: string) => fetchAPI(`/workshops/${slug}/`),
  getFilters: () => fetchAPI('/workshops/filters/'),
};

// Education API - matches backend education app endpoints
export const educationAPI = {
  getCategories: () => fetchAPI('/education/categories/'),
  getAudiences: () => fetchAPI('/education/audiences/'),
  getCourses: (params?: { category?: string; audience?: string; difficulty?: string; format?: string; is_featured?: boolean; page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.audience) query.append('audience', params.audience);
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.format) query.append('format', params.format);
    if (params?.is_featured) query.append('is_featured', 'true');
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());
    return fetchAPI(`/education/courses/?${query.toString()}`);
  },
  getCourseBySlug: (slug: string) => fetchAPI(`/education/courses/${slug}/`),
  getGuides: (params?: { category?: string; audience?: string; difficulty?: string; is_featured?: boolean; page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.audience) query.append('audience', params.audience);
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.is_featured) query.append('is_featured', 'true');
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());
    return fetchAPI(`/education/guides/?${query.toString()}`);
  },
  getGuideBySlug: (slug: string) => fetchAPI(`/education/guides/${slug}/`),
  getWorkshops: (params?: { format?: string; status?: string; category?: string; page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.format) query.append('format', params.format);
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());
    return fetchAPI(`/education/workshops/?${query.toString()}`);
  },
  getWorkshopBySlug: (slug: string) => fetchAPI(`/education/workshops/${slug}/`),
  getLearningPaths: () => fetchAPI('/education/learning-paths/'),
  getLearningPathBySlug: (slug: string) => fetchAPI(`/education/learning-paths/${slug}/`),
  getLandingPage: (pageType: string) => fetchAPI(`/education/landing-pages/${pageType}/`),
  submitCourseInquiry: (data: Record<string, unknown>) =>
    fetchAPI('/education/inquiries/course/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  submitOrgInquiry: (data: Record<string, unknown>) =>
    fetchAPI('/education/inquiries/organization/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  registerForWorkshop: (slug: string, data: Record<string, unknown>) =>
    fetchAPI(`/education/workshops/${slug}/register/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const agentsAPI = {
  getAll: (params?: { category?: string; pricing?: string; access?: string; search?: string; sort?: string; page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.pricing) query.append('pricing', params.pricing);
    if (params?.access) query.append('access', params.access);
    if (params?.search) query.append('search', params.search);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());
    return fetchAPI(`/api/agents/?${query.toString()}`);
  },
  getBySlug: (slug: string) => fetchAPI(`/api/agents/${slug}/`),
  getCategories: () => fetchAPI('/api/agents/categories/'),
  getStats: () => fetchAPI('/api/agents/stats/'),
};

export const pricingAPI = {
  getConfig: () => fetchAPI('/api/config/pricing/'),
  reportPricing: (toolSlug: string, data: { email?: string; session_id?: string; message?: string }) =>
    fetchAPI(`/api/tools/${toolSlug}/report-pricing/`, {
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
