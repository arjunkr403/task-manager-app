import { Link } from 'react-router-dom'

export default function BoardCard({ id, title }) {
  return (
    <div className="card border rounded-2xl p-5 shadow-sm">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <Link to={`/board/${id}`} className="inline-block px-4 py-2 rounded-md bg-brand text-white text-sm font-semibold">View Tasks</Link>
    </div>
  )
}
