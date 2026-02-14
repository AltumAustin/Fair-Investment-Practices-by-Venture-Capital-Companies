"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PortfolioCompany {
  id: string;
  name: string;
  principalPlaceOfBusiness: string | null;
  createdAt: string;
  _count?: { foundingTeamMembers: number; investments: number };
}

export default function PortfolioPage() {
  const [companies, setCompanies] = useState<PortfolioCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", principalPlaceOfBusiness: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      }
    } catch (err) {
      console.error("Failed to load companies:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ name: "", principalPlaceOfBusiness: "" });
        setShowForm(false);
        fetchCompanies();
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Failed to save company. Please try again.");
      }
    } catch (err) {
      console.error("Failed to create company:", err);
      setError("Network error. Please check your connection and try again.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) fetchCompanies();
    } catch (err) {
      console.error("Failed to delete company:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Companies</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your portfolio companies and founding team members
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
        >
          + Add Company
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add Portfolio Company</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Principal Place of Business
              </label>
              <input
                type="text"
                value={formData.principalPlaceOfBusiness}
                onChange={(e) =>
                  setFormData({ ...formData, principalPlaceOfBusiness: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Company"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No portfolio companies yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-blue-900 font-medium text-sm hover:underline"
          >
            Add your first company
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Founders
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Investments
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/portfolio/${company.id}`}
                      className="font-medium text-blue-900 hover:underline"
                    >
                      {company.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {company.principalPlaceOfBusiness || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-600">
                    {company._count?.foundingTeamMembers || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-600">
                    {company._count?.investments || 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/portfolio/${company.id}`}
                      className="text-sm text-blue-900 hover:underline mr-4"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
