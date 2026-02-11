"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface FoundingTeamMember {
  id: string;
  name: string;
  email: string;
  title: string | null;
  isPassiveInvestor: boolean;
}

interface Company {
  id: string;
  name: string;
  principalPlaceOfBusiness: string | null;
  foundingTeamMembers: FoundingTeamMember[];
}

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    title: "",
    isPassiveInvestor: false,
  });
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", principalPlaceOfBusiness: "" });

  const fetchCompany = async () => {
    try {
      const res = await fetch(`/api/portfolio/${companyId}`);
      if (res.ok) {
        const data = await res.json();
        setCompany(data);
        setEditForm({
          name: data.name,
          principalPlaceOfBusiness: data.principalPlaceOfBusiness || "",
        });
      }
    } catch (err) {
      console.error("Failed to load company:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/portfolio/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditing(false);
        fetchCompany();
      }
    } catch (err) {
      console.error("Failed to update company:", err);
    }
    setSaving(false);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/founding-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...memberForm, portfolioCompanyId: companyId }),
      });
      if (res.ok) {
        setMemberForm({ name: "", email: "", title: "", isPassiveInvestor: false });
        setShowMemberForm(false);
        fetchCompany();
      }
    } catch (err) {
      console.error("Failed to add member:", err);
    }
    setSaving(false);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this founding team member?")) return;
    try {
      const res = await fetch(`/api/founding-members/${memberId}`, { method: "DELETE" });
      if (res.ok) fetchCompany();
    } catch (err) {
      console.error("Failed to delete member:", err);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mb-8"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Company not found.</p>
        <Link href="/portfolio" className="text-blue-900 text-sm mt-2 hover:underline">
          Back to portfolio
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2">
        <Link href="/portfolio" className="text-sm text-blue-900 hover:underline">
          &larr; Back to Portfolio
        </Link>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        {editing ? (
          <form onSubmit={handleUpdateCompany} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Principal Place of Business
              </label>
              <input
                type="text"
                value={editForm.principalPlaceOfBusiness}
                onChange={(e) =>
                  setEditForm({ ...editForm, principalPlaceOfBusiness: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-800 disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {company.principalPlaceOfBusiness || "No location set"}
              </p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-blue-900 hover:underline"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Founding Team Members */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Founding Team Members</h2>
        <button
          onClick={() => setShowMemberForm(!showMemberForm)}
          className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
        >
          + Add Member
        </button>
      </div>

      {showMemberForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={memberForm.title}
                  onChange={(e) => setMemberForm({ ...memberForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., CEO, President, Founder"
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={memberForm.isPassiveInvestor}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, isPassiveInvestor: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-900"
                  />
                  <span className="text-sm text-gray-700">Passive Investor</span>
                </label>
              </div>
            </div>
            {memberForm.isPassiveInvestor && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-sm text-amber-800">
                  Passive investors are excluded from the demographic survey per the statute.
                  They will not receive survey invitations.
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-800 disabled:opacity-50"
              >
                {saving ? "Adding..." : "Add Member"}
              </button>
              <button
                type="button"
                onClick={() => setShowMemberForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {company.foundingTeamMembers.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No founding team members yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {company.foundingTeamMembers.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {member.title || "—"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {member.isPassiveInvestor ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Passive Investor
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Eligible
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
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
