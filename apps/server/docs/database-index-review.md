# Phase 11 database index review

This review is based on `schema.prisma`, the public profile repository, the
admin-content repository, and the authentication repository.

## Already covered

| Query pattern | Existing coverage |
| --- | --- |
| Admin lookup by `email` | `Admin.email @unique` creates a unique index. |
| Admin lookup by `id` | Primary-key index. |
| Refresh-token lookup by `tokenHash` | `RefreshToken.tokenHash @unique` creates a unique index. |
| Project lookup by `id` and `slug` | Primary-key and `Project.slug @unique` indexes. |
| Blog-post lookup by `id` and `slug` | Primary-key and `BlogPost.slug @unique` indexes. |
| Skill lookup by `name` | `Skill.name @unique` creates a unique index. |
| Refresh-token to admin relation | The relation is traversed after a unique `tokenHash` lookup; no separate `adminId`-only lookup is implemented. |

## Added indexes

| Index | Query pattern supported | Rationale |
| --- | --- | --- |
| `Project(category, updatedAt)` | Admin project category filter with the default `updatedAt desc` ordering. | Supports the most common filtered project list without an additional sort step. |
| `Project(status, updatedAt)` | Admin project status filter with the default `updatedAt desc` ordering. | Supports the other enumerated project filter and default ordering. |
| `BlogPost(category, updatedAt)` | Admin blog-post category filter with the default `updatedAt desc` ordering. | Supports the documented category-filtered list path. |
| `BlogPost(published, publishedAt)` | Public profile's published-post query ordered by `publishedAt desc`. | Supports the existing public profile read path. |

## Intentionally not indexed

The Phase 11 `search` filters use case-insensitive substring matching
(`contains`). Ordinary B-tree indexes do not materially accelerate that
pattern. No full-text or trigram index is added because the current API has no
full-text-search requirement and adding PostgreSQL extensions would exceed
Phase 11 scope.

No indexes were added for every possible sort or low-volume portfolio table.
Those would be speculative and add write overhead without an observed query
need.
