import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { directoryPageTitle, fitSeoTitle } from '../src/lib/utils/seo';
import { popularityDisplay, popularityFromRecord } from '../src/lib/popularity';
import { displayAccessLabel } from '../src/lib/accessLabel';
import {
  activeFilterCount,
  catalogApiQuery,
  catalogQueryFromParams,
  catalogSearchParams,
} from '../src/lib/catalogQuery';
import { toolCanonicalPath } from '../src/lib/listingIdentity';

describe('titles', () => {
  it('does not leave a dangling conjunction', () => {
    const title = fitSeoTitle('Wondershare Filmora - Review, Features & Alternatives');
    assert.equal(title.endsWith('& | One9Founders'), false);
    assert.match(title, /Alternatives \| One9Founders$/);
  });

  it('does not call an unassessed page a review', () => {
    assert.equal(
      directoryPageTitle('Wondershare Filmora', false).includes('Review'),
      false,
    );
    assert.match(directoryPageTitle('Wondershare Filmora', true), /Pricing, Features & Alternatives/);
  });
});

describe('popularity', () => {
  it('does not clamp an out-of-range score into a percentage', () => {
    const display = popularityDisplay(106);
    assert.equal(display.state, 'unbounded');
    assert.equal(display.value, 106);
    assert.equal(display.label.includes('/100'), false);
  });

  it('shows a missing score as unavailable', () => {
    assert.equal(popularityDisplay(0).state, 'unavailable');
    assert.equal(popularityFromRecord(106, { state: 'unavailable', value: null }).state, 'unavailable');
  });
});

describe('access labels', () => {
  it('hides Open Source when no repository is recorded', () => {
    assert.equal(displayAccessLabel({ access: 'Open Source', github_url: '' }), null);
    assert.equal(displayAccessLabel({ access: 'Open Source', github_url: 'https://github.com/example/app' }), 'Open Source');
    assert.equal(displayAccessLabel({ access: 'Open Source', display_access: null }), null);
  });
});

describe('catalog query', () => {
  it('keeps filters, sort, and page in one shareable query', () => {
    const query = catalogQueryFromParams({
      get(name: string) {
        const values: Record<string, string> = {
          q: 'video',
          category: 'Video',
          pricing: 'freemium,paid',
          job: 'support',
          deployment: 'web',
          integration: 'Slack',
          sort: 'newest',
          page: '2',
        };
        return values[name] ?? null;
      },
    });
    assert.equal(activeFilterCount(query), 6);
    const api = catalogApiQuery(query);
    assert.equal(api.q, 'video');
    assert.equal(api.pricing_type, 'freemium,paid');
    assert.equal(api.job_cluster, 'support');
    assert.equal(api.ordering, '-created_at');
    assert.equal(api.page, '2');
    const params = catalogSearchParams(query);
    assert.equal(params.get('q'), 'video');
    assert.equal(params.get('page'), '2');
    assert.equal(params.get('sort'), 'newest');
  });

  it('defaults a search to relevance and a browse to name', () => {
    const searched = catalogQueryFromParams({ get: (name) => (name === 'q' ? 'inbox' : null) });
    assert.equal(searched.sort, 'relevance');
    assert.equal(catalogApiQuery(searched).ordering, undefined);
    const browse = catalogQueryFromParams({ get: () => null });
    assert.equal(browse.sort, 'name');
    assert.equal(catalogApiQuery(browse).ordering, 'name');
  });
});

describe('canonical identity', () => {
  it('points a duplicate tool at the agent path and leaves unique tools alone', () => {
    assert.deepEqual(toolCanonicalPath({ slug: '15minutes', preferred_path: '/agents/15minutes' }), {
      path: '/agents/15minutes',
      duplicateOfAgent: true,
    });
    assert.equal(toolCanonicalPath({ slug: 'filmora', preferred_path: null }).duplicateOfAgent, false);
  });
});
