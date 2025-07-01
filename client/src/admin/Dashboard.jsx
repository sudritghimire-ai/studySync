"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Search, Trash2, Shield, Users, Eye, EyeOff } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [code, setCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [authorized, setAuthorized] = useState(() => localStorage.getItem("authorized") === "true")
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const handleEnter = async () => {
    if (!code.trim()) {
      toast.error("Please enter the admin code")
      return
    }
    setLoading(true)
    setError("")
    try {
      await axios.post("/api/admin/verify", { code }, { withCredentials: true })
      setAuthorized(true)
      localStorage.setItem("authorized", "true")
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid admin code")
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/admin/users", { withCredentials: true })
      setUsers(res.data)
    } catch (err) {
      console.error("Error fetching users:", err)
      toast.error(err.response?.data?.message || "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`, { withCredentials: true })
      fetchUsers()
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      toast.success("User deleted successfully")
    } catch (err) {
      toast.error("Failed to delete user")
    }
  }

  const openDeleteDialog = (user) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  useEffect(() => {
    if (authorized) {
      axios
        .get("/api/admin/check", { withCredentials: true })
        .then(() => {
          fetchUsers()
        })
        .catch(() => {
          localStorage.removeItem("authorized")
          setAuthorized(false)
        })
    }
  }, [authorized])

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleEnter()
    }
  }

  if (!authorized) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0 overflow-hidden">
            <div className="text-center space-y-4 p-8 pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Admin Access</h2>
                <p className="text-slate-600 mt-2">Enter your admin code to access the dashboard</p>
              </div>
            </div>
            <div className="p-8 pt-0 space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full h-12 px-4 pr-12 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-12 px-3 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <button
                  onClick={handleEnter}
                  disabled={loading || !code.trim()}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg transition-all duration-200"
                >
                  {loading ? "Verifying..." : "Access Dashboard"}
                </button>
                <Link
                  to="/"
                  className="block mx-auto mt-10 w-fit text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-300 px-4 py-2 border border-blue-600 rounded-full shadow hover:shadow-md"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ marginTop: "80px" }}
        />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
                  <p className="text-sm text-slate-500">User Management System</p>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Authorized
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border-0 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Users</p>
                  <p className="text-3xl font-bold text-blue-900">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border-0 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Filtered Results</p>
                  <p className="text-3xl font-bold text-green-900">{filteredUsers.length}</p>
                </div>
                <Search className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border-0 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">System Status</p>
                  <p className="text-lg font-semibold text-purple-900">Active</p>
                </div>
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border-0 overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50/50 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">User Management</h3>
                  <p className="text-slate-600 text-sm">Manage and monitor user accounts</p>
                </div>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading users...</p>
                  </div>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="text-left py-4 px-6 font-semibold text-slate-700">Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-700">Email</th>
                      <th className="text-right py-4 px-6 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-12">
                          <div className="text-slate-500">
                            <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p className="text-lg font-medium mb-2">No users found</p>
                            <p className="text-sm">
                              {searchTerm ? "Try adjusting your search terms" : "No users available"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-slate-700">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-slate-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600">{user.email}</td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => openDeleteDialog(user)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-transparent border border-red-200 rounded-md hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-1.5" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete User</h3>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setDeleteDialogOpen(false)
                      setUserToDelete(null)
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-300 rounded-md hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteUser(userToDelete._id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ marginTop: "80px" }}
      />
    </>
  )
}

export default AdminDashboard
