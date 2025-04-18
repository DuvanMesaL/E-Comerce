import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <div className="text-center py-12 glass border border-primary-700/30 rounded-lg">
      <h1 className="text-6xl font-bold text-primary-300 mb-4 neon-text">404</h1>
      <h2 className="text-3xl font-semibold mb-6 text-white">Page Not Found</h2>
      <p className="text-white/70 mb-8 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg inline-block transition-colors">
        Go to Homepage
      </Link>
    </div>
  )
}

export default NotFoundPage
