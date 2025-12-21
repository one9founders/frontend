const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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
    
    // Handle Django paginated response
    if (data && typeof data === 'object' && 'results' in data) {
      return data.results;
    }
    
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
  getAll: (params?: { category?: string; pricing?: string; featured?: boolean; startup_friendly?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.pricing) query.append('pricing', params.pricing);
    if (params?.featured) query.append('featured', 'true');
    if (params?.startup_friendly) query.append('startup_friendly', 'true');
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
    fetchAPI(`/reviews/?tool=${toolId}`),
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
