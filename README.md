# Coding Exercise: Movie Browser

**Time limit:** 45 minutes  
**Stack:** React + TypeScript  
**Rules:** No AI assistance. No autocomplete beyond basic syntax highlighting. Talk out loud as you code.

---

## The Problem

You have been given access to a public REST API that returns a list of movies. Build a Movie Browser that displays this data as a filterable, paginated list of cards.

**API endpoint:** `GET https://api.themoviedb.org/3/discover/movie`

Requires a TMDB API key passed as `api_key`. The endpoint returns a paginated results array. Each movie object has at minimum: `id`, `title`, `release_date`, `genre_ids` (an array of genre IDs resolved via `/3/genre/movie/list`), `vote_average` (0–10 rating), and `overview`. Note: `director` is not included in the discover response — it requires a separate `/3/movie/{id}/credits` call per movie and is out of scope for this exercise.

---

## Requirements

### Core (complete these first)

1. Fetch and display the list of movies as a grid of cards. Each card should show: **title**, **year**, **rating** (`vote_average`), and **description** (`overview`). Display the first genre tag as a badge. (Director substituted with description — not available from the discover endpoint without per-movie credit calls.)
2. Show a loading state while data is being fetched
3. Show an error state if the fetch fails
4. Add a text input that filters the cards by **title**, **genre**, and **year** — partial matches should work, case-insensitive
5. Add pagination — display **6 cards per page** with previous/next controls. Applying a filter should reset to page 1

### Stretch (only if time permits)

6. Sort cards by **rating** (high to low) or **year** (newest first) via a dropdown
7. Show an empty state message when the filter returns no results

---

## What We're Looking For

- **Types first.** Define your interfaces and types before writing any component code.
- **Clean component structure.** Separate concerns — data fetching, filtering logic, and rendering should not all live in one component.
- **Behavior over appearance.** A working, unstyled solution is better than a polished, broken one.
- **Edge cases.** What happens when the fetch fails? When the filter matches nothing? When you're on page 3 and apply a filter?
- **Think out loud.** Explain your decisions as you go — we're evaluating your reasoning, not just the output.

---

## Ground Rules

- Read this entire prompt before writing any code
- Start with TypeScript types and interfaces
- Write the component skeleton before filling in logic
- Get the happy path working before handling edge cases
- Run your code early and often — an empty component that renders is a good first checkpoint

---

## Suggested Approach

1. Define a `Movie` interface that matches the API response shape
2. Write a `useFetch` hook (or inline fetch logic) for the API call
3. Build a `MovieCard` component — static first, then wired to real data
4. Build the `MovieBrowser` container — render the card grid, handle loading and error states
5. Add the filter input and filtering logic
6. Add pagination
7. Stretch: sort dropdown, empty state

---

*You have 45 minutes. Good luck.*
