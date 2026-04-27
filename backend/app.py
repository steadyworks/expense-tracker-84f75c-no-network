from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_expenses = []


class ExpenseCreate(BaseModel):
    amount: Optional[float] = None
    category: str = ""
    description: str = ""
    type: Optional[str] = None


@app.get("/api/expenses")
def get_expenses():
    return _expenses


@app.post("/api/expenses", status_code=201)
def create_expense(body: ExpenseCreate):
    if body.amount is None or not isinstance(body.amount, (int, float)) or body.amount <= 0:
        raise HTTPException(status_code=400, detail="amount must be a positive number")
    if body.type not in ("income", "expense"):
        raise HTTPException(status_code=400, detail='type must be "income" or "expense"')

    entry = {
        "id": str(uuid.uuid4()),
        "amount": float(body.amount),
        "category": body.category,
        "description": body.description,
        "type": body.type,
    }
    _expenses.append(entry)
    return entry


@app.delete("/api/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: str):
    global _expenses
    original_len = len(_expenses)
    _expenses = [e for e in _expenses if e["id"] != expense_id]
    if len(_expenses) == original_len:
        raise HTTPException(status_code=404, detail="not found")
    return Response(status_code=204)


@app.get("/api/summary")
def get_summary():
    income_total = sum(e["amount"] for e in _expenses if e["type"] == "income")
    expense_total = sum(e["amount"] for e in _expenses if e["type"] == "expense")
    return {
        "balance": income_total - expense_total,
        "income": income_total,
        "expenses": expense_total,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
