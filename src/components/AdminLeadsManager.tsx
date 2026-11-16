"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Download,
  Phone,
  Mail,
  MessageSquare,
  BookOpen,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Package,
} from "lucide-react";

interface LeadRecord {
  id: string;
  parentName: string;
  parent_name?: string;
  email: string;
  phone: string;
  childName?: string;
  child_name?: string;
  childAge?: string;
  child_age?: string;
  subjects?: string[] | string;
  workbookInterest?: boolean;
  workbook_interest?: boolean | number;
  notes?: string;
  createdAt?: string;
  created_at?: string;
}

export default function AdminLeadsManager() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/early-access");
      if (res.ok) {
        const json = await res.json();
        setLeads(json.data || []);
      }
    } catch (err) {
      console.warn("Could not fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  // Normalize record attributes (handles both MySQL snake_case and JSON camelCase)
  const normalizedLeads = leads.map((lead) => ({
    id: lead.id,
    parentName: lead.parentName || lead.parent_name || "Parent",
    email: lead.email || "",
    phone: lead.phone || "",
    childName: lead.childName || lead.child_name || "Child",
    childAge: lead.childAge || lead.child_age || "Grade R - 3",
    subjects: Array.isArray(lead.subjects)
      ? lead.subjects
      : typeof lead.subjects === "string"
      ? JSON.parse(lead.subjects || "[]")
      : [],
    workbookInterest: Boolean(lead.workbookInterest || lead.workbook_interest),
    notes: lead.notes || "",
    createdAt: lead.createdAt || lead.created_at || new Date().toISOString(),
  }));

  // Filtering
  const filtered = normalizedLeads.filter((l) => {
    const matchesSearch =
      l.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.childName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade =
      gradeFilter === "all" ||
      l.childAge.toLowerCase().includes(gradeFilter.toLowerCase());

    return matchesSearch && matchesGrade;
  });

  const workbookCount = normalizedLeads.filter((l) => l.workbookInterest).length;

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["ID", "Parent Name", "Phone", "Email", "Child Name", "Age/Grade", "Subjects", "Workbook Interest", "Date"];
    const rows = filtered.map((l) => [
      `"${l.id}"`,
      `"${l.parentName}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.childName}"`,
      `"${l.childAge}"`,
      `"${l.subjects.join(", ")}"`,
      `"${l.workbookInterest ? "YES" : "No"}"`,
      `"${new Date(l.createdAt).toLocaleDateString("en-ZA")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sir_xolo_academy_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp quick launch
  const openWhatsApp = (phone: string, parentName: string, childName: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "27" + clean.slice(1);
    }
    const message = encodeURIComponent(
      `Sawubona / Hello ${parentName}! This is Mr. Xolo from Sir Xolo Academy. Thank you for registering ${childName || "your child"} for our Foundation Phase Learning program. How can I assist you today?`
    );
    window.open(`https://wa.me/${clean}?text=${message}`, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-black uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5 text-emerald-300" />
            <span>Parent Registrations & Enrollment CRM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Parent Leads & Early Access
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
            View parents who registered for early access, filter by grade, export to CSV, or connect directly on WhatsApp with 1 tap.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchLeads}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border border-white/20"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportToCSV}
            disabled={filtered.length === 0}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Total Leads</span>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">{normalizedLeads.length}</div>
          <p className="text-[11px] font-bold text-emerald-600 mt-1">Parents awaiting launch</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Workbook Kits</span>
          <div className="text-3xl sm:text-4xl font-black text-indigo-600 mt-1">{workbookCount}</div>
          <p className="text-[11px] font-bold text-indigo-700 mt-1">
            {normalizedLeads.length > 0 ? Math.round((workbookCount / normalizedLeads.length) * 100) : 0}% want printed books
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Filtered View</span>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">{filtered.length}</div>
          <p className="text-[11px] font-bold text-slate-500 mt-1">Matching search criteria</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Delivery Coverage</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">Nationwide</div>
          <p className="text-[11px] font-bold text-slate-500 mt-1">South Africa Courier Ready</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search parent, phone, child..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Filter:</span>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white cursor-pointer"
          >
            <option value="all">All Grades & Ages</option>
            <option value="grade r">Grade R</option>
            <option value="grade 1">Grade 1</option>
            <option value="grade 2">Grade 2</option>
            <option value="grade 3">Grade 3</option>
          </select>
        </div>
      </div>

      {/* Leads Table / Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-sm">No parent registrations match your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((lead) => (
              <div
                key={lead.id}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Parent & Child info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-base sm:text-lg font-black text-slate-900">{lead.parentName}</span>
                    <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                      Learner: {lead.childName} ({lead.childAge})
                    </span>
                    {lead.workbookInterest && (
                      <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                        <Package className="w-3 h-3 text-amber-700" />
                        <span>Workbook Pack Requested</span>
                      </span>
                    )}
                  </div>

                  {/* Contact details */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-semibold pt-1">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lead.phone}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lead.email}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 font-normal">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(lead.createdAt).toLocaleDateString("en-ZA")}</span>
                    </span>
                  </div>

                  {/* Interested Subjects */}
                  {lead.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {lead.subjects.map((sub: string, sIdx: number) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {lead.notes && (
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 mt-2 font-medium">
                      💬 <span className="font-bold">Parent Note:</span> &ldquo;{lead.notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* 1-Click WhatsApp Connect Button */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => openWhatsApp(lead.phone, lead.parentName, lead.childName)}
                    className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>WhatsApp Parent</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
