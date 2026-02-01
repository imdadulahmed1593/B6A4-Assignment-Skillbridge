"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { adminApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiUser,
  FiMail,
  FiShield,
} from "react-icons/fi";
import { User } from "@/types";

export default function AdminUsersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push("/login");
      } else if (session.user.role !== "ADMIN") {
        toast.error("Access denied. Admin privileges required.");
        router.push("/dashboard");
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchUsers();
    }
  }, [session, pagination.page, roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;

      const response = await adminApi.getUsers(params);
      setUsers(response.data || []);
      if (response.meta) {
        setPagination((prev) => ({
          ...prev,
          total: response.meta!.total,
          totalPages: response.meta!.totalPages,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      toast.success("User role updated successfully!");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user role");
    }
  };

  if (isPending) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-48 mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-secondary-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "ADMIN") return null;

  const roleColors: Record<string, string> = {
    USER: "bg-green-100 text-green-700",
    TUTOR: "bg-blue-100 text-blue-700",
    ADMIN: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-secondary-600 hover:text-primary-600">
            <FiChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Manage Users</h1>
            <p className="text-secondary-600">View and manage all platform users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="input-field w-full pl-10"
                />
              </div>
            </form>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="input-field w-full sm:w-auto"
            >
              <option value="">All Roles</option>
              <option value="USER">Students</option>
              <option value="TUTOR">Tutors</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-secondary-100 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <FiUser className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">No users found</h3>
              <p className="text-secondary-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Verified
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-lg font-bold text-primary-600">
                                {user.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <span className="font-medium text-secondary-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-secondary-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.emailVerified ? (
                          <span className="text-green-600">✓ Yes</span>
                        ) : (
                          <span className="text-red-600">✗ No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-secondary-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="input-field py-1 text-sm"
                          disabled={user.id === session.user.id}
                        >
                          <option value="USER">Student</option>
                          <option value="TUTOR">Tutor</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-secondary-600 text-sm">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="btn bg-white border border-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft />
              </button>
              <span className="text-secondary-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="btn bg-white border border-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
