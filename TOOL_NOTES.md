# Tool Notes

## Supabase
- The RPC `search_restaurants` is the core of the discovery system. It handles name, cuisine, area, and dish matching.
- **Relational Joins**: When using `admin_reviews(verdict)`, Supabase returns an array. Access via `admin_reviews?.[0]?.verdict`.
- **Ranking Weights**: Currently set to 60% Admin Score, 20% Community, 15% Keyword, 5% Freshness.

## Next.js
- **Turbopack**: Dev server is running on port 3000.
- **Persistent Terminals**: Use `npm run dev` in a persistent terminal to keep the server alive during browser testing.

## Browser Testing
- Use the browse subagent to verify specific search queries (e.g. "jerk", "Moby Dick") as it can detect rendering issues that server logs might miss.
