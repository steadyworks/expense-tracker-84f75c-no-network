# Expense Tracker

The scaffold provides the file structure and stub implementations. Fill in the TODOs to make the app work.

## `backend/app.py`

Implement the four route handlers using FastAPI:

- `GET /api/expenses` — return the `_expenses` list as JSON (200)
- `POST /api/expenses` — create an expense entry with a unique `id`, `amount` (float), `category` (string), `description` (string), and `type` (either `"income"` or `"expense"`). Return 201. Raise `HTTPException(400)` if `amount` is missing, not a positive number, or if `type` is not `"income"` or `"expense"`.
- `DELETE /api/expenses/{expense_id}` — remove the matching entry and return 204. Raise `HTTPException(404)` if not found.
- `GET /api/summary` — return `{"balance": <income - expenses>, "income": <total income>, "expenses": <total expenses>}` (200)

## `frontend/app/page.jsx`

This is a Next.js App Router page with `'use client'` already set. Fill in the TODO sections:

- On mount, fetch `/api/expenses` and `/api/summary` and store results in state
- `addExpense` — POST the form values to the API, then re-fetch both endpoints to refresh state; clear the amount and description inputs after success
- `deleteExpense(id)` — DELETE from the API, then re-fetch both endpoints

## UI Requirements

Use these `data-testid` attributes exactly:

- `data-testid="amount-input"` on the amount `<input>`
- `data-testid="description-input"` on the description `<input>`
- `data-testid="category-input"` on the category `<input>` (free-text, e.g. "food")
- `data-testid="type-select"` on the income/expense `<select>` (options: `"income"`, `"expense"`)
- `data-testid="add-button"` on the submit button
- `data-testid="expense-list"` on the container that lists all entries
- `data-testid="balance"` displaying the current balance (e.g. `"Balance: $800.00"`)
- `data-testid="total-income"` displaying total income (e.g. `"Income: $1000.00"`)
- `data-testid="total-expenses"` displaying total expenses (e.g. `"Expenses: $200.00"`)
- `data-testid="filter-select"` on the filter `<select>` (options: `"all"`, `"income"`, `"expense"`)
- Each entry in the list should have a **Delete** button, titled verbatim (`Delete`)
