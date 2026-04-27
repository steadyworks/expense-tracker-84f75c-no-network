'use client'
import { useState, useEffect } from 'react'

const API = 'http://localhost:8000/api'

export default function Home() {
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState({ balance: 0, income: 0, expenses: 0 })
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState('expense')

  const fetchData = async () => {
    const [expRes, sumRes] = await Promise.all([
      fetch(`${API}/expenses`),
      fetch(`${API}/summary`),
    ])
    setExpenses(await expRes.json())
    setSummary(await sumRes.json())
  }

  useEffect(() => { fetchData() }, [])

  const addExpense = async () => {
    const parsed = parseFloat(amount)
    if (!amount || isNaN(parsed) || parsed <= 0) return
    const res = await fetch(`${API}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parsed, category, description, type }),
    })
    if (res.ok) {
      setAmount('')
      setDescription('')
      await fetchData()
    }
  }

  const deleteExpense = async (id) => {
    await fetch(`${API}/expenses/${id}`, { method: 'DELETE' })
    await fetchData()
  }
  const fmt = (n) => `$${Number(n).toFixed(2)}`

  return (
    <div>
      <h1>Expense Tracker</h1>

      <div>
        <span data-testid="balance">Balance: {fmt(summary.balance)}</span>
        {' | '}
        <span data-testid="total-income">Income: {fmt(summary.income)}</span>
        {' | '}
        <span data-testid="total-expenses">Expenses: {fmt(summary.expenses)}</span>
      </div>

      <div>
        <input
          data-testid="amount-input"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount"
          type="number"
        />
        <input
          data-testid="description-input"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          data-testid="category-input"
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="Category"
        />
        <select
          data-testid="type-select"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="income">income</option>
          <option value="expense">expense</option>
        </select>
        <button data-testid="add-button" onClick={addExpense}>Add</button>
      </div>

      <div data-testid="expense-list">
        {expenses.map(e => (
          <div key={e.id}>
            <span>[{e.type}] {e.description} ({e.category}) — {fmt(e.amount)}</span>
            <button onClick={() => deleteExpense(e.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
