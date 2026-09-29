/** Future optional import seam; no Takeout parser is implemented in Phase 1. */
export type ActivityEvent = { kind:'watched_video'|'search'; occurredAt:string; videoId?:string; query?:string; source:string };
export interface ActivitySource { readonly name:string; import(): AsyncIterable<ActivityEvent>; }
