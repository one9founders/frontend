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
  getAll: (params?: { category?: string; pricing?: string; featured?: boolean; startup_friendly?: boolean; page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.pricing) query.append('pricing', params.pricing);
    if (params?.featured) query.append('featured', 'true');
    if (params?.startup_friendly) query.append('startup_friendly', 'true');
    if (params?.page) query.append('page', params.page.toString());
    if (params?.page_size) query.append('page_size', params.page_size.toString());
    return fetchAPI(`/tools/?${query.toString()}`);
  },
  getBySlug: (slug: string) => fetchAPI(`/tools/${slug}/`),
  search: (query: string) => 
    fetchAPI('/tools/search/', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
  create: (data: any) =>
    fetchAPI('/tools/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (slug: string, data: any) =>
    fetchAPI(`/tools/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (slug: string) =>
    fetchAPI(`/tools/${slug}/`, {
      method: 'DELETE',
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
