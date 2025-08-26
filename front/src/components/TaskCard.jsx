export default function TaskCard({ title, description }) {
  return (
    <div className="card border rounded-xl p-4 shadow-sm">
      <p className="font-semibold">{title}</p>
      {description && <p className="text-sm muted mt-1">{description}</p>}
    </div>
  )
}
