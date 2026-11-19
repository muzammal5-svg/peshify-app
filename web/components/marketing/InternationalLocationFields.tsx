"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, MapPin, Building, ChevronDown } from "lucide-react";

export interface LocationValues {
  country: string;
  city: string;
  province?: string;
  district?: string;
  tehsil?: string;
  location?: string;
}

export const POPULAR_COUNTRIES = [
  "Pakistan",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Saudi Arabia",
  "Canada",
  "Qatar",
  "Oman",
  "Bahrain",
  "Kuwait",
  "India",
  "Australia",
  "Malaysia",
  "Singapore",
  "Germany",
  "Turkey",
  "South Africa",
  "Kenya",
  "Nigeria",
  "Ireland",
  "France",
  "New Zealand",
  "Bangladesh",
  "Sri Lanka",
  "Egypt",
  "Other / Global",
];

interface InternationalLocationFieldsProps {
  values: LocationValues;
  onChange: (values: LocationValues) => void;
  touched?: boolean;
}

export function InternationalLocationFields({
  values,
  onChange,
  touched = false,
}: InternationalLocationFieldsProps) {
  const { t } = useTranslation();
  const selectedCountry = values.country || "Pakistan";
  const cityValid = (values.city || "").trim().length >= 2;

  return (
    <div className="space-y-3.5">
      {/* Country Selection */}
      <div className="relative">
        <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>Country / Jurisdiction</span>
        </label>
        <div className="relative">
          <select
            value={selectedCountry}
            onChange={(e) => {
              const country = e.target.value;
              onChange({
                ...values,
                country,
                // reset Pakistan-specific district/tehsil if not Pakistan
                ...(country !== "Pakistan" ? { district: "", tehsil: "" } : {}),
              });
            }}
            className="w-full h-11 px-3.5 pe-10 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 appearance-none cursor-pointer transition-colors"
          >
            {POPULAR_COUNTRIES.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-slate-100">
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute end-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* City & State / Province Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* City (Required) */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>City *</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Lahore, Dubai, London, New York"
            value={values.city || ""}
            onChange={(e) => onChange({ ...values, city: e.target.value })}
            className={`w-full h-11 px-3.5 bg-slate-900 border rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors ${
              touched && !cityValid
                ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                : "border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            }`}
          />
          {touched && !cityValid && (
            <p className="mt-1 text-[11px] text-rose-400">City is required</p>
          )}
        </div>

        {/* State / Province (Optional) */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>State / Province (Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Punjab, England, Ontario, Sindh"
            value={values.province || ""}
            onChange={(e) => onChange({ ...values, province: e.target.value })}
            className="w-full h-11 px-3.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
