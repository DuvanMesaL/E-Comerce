"use client"

import { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { CartContext } from "../context/CartContext"

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext)
  const { cart } = useContext(CartContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Cerrar el menú de usuario cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (userMenuOpen && !target.closest(".user-menu-container")) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [userMenuOpen])

  return (
    <nav
      className={`${scrolled ? "glass-dark shadow-lg" : "bg-transparent"} py-4 sticky top-0 z-50 border-b border-primary-700/30 transition-all duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold neon-text">
              E-Commerce
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-white/80 hover:text-primary-300 transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/products" className="text-white/80 hover:text-primary-300 transition-colors relative group">
                Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative text-white/80 hover:text-primary-300 transition-colors group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cart && cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse-purple">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-white/80 hover:text-primary-300 transition-colors"
                >
                  <span>{user?.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-dark rounded-md shadow-lg py-1 z-10 border border-primary-700/30">
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-white/80 hover:bg-primary-700/20 hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setUserMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-primary-700/20 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-3">
                <Link to="/login" className="text-white/80 hover:text-primary-300 transition-colors relative group">
                  Login
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md transition-colors shadow-md hover:shadow-lg hover:shadow-primary-900/30"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white focus:outline-none">
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 glass-dark rounded-lg p-4 border border-primary-700/30 transform transition-all duration-300 scale-95 opacity-100">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-white/80 hover:text-primary-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-white/80 hover:text-primary-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/cart"
                className="text-white/80 hover:text-primary-300 transition-colors flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cart
                {cart && cart.totalItems > 0 && (
                  <span className="ml-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    className="text-white/80 hover:text-primary-300 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="text-left text-white/80 hover:text-primary-300 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white/80 hover:text-primary-300 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md text-center transition-colors shadow-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
