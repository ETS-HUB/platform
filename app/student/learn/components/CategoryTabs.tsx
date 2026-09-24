"use client";

import React from "react";

interface CategoryTabsProps {
  categories: { id: string; name: string; icon: string }[];
  active: string;
  onChange: (id: string) => void;
}

export function CategoryTabs({
  categories,
  active,
  onChange,
}: CategoryTabsProps) {
  const tabs = [{ id: "all", name: "All Courses", icon: "" }, ...categories];

  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="text-sm cursor-pointer hover:scale-95 transition-transform font-medium px-5 py-2.5 rounded-full transition-colors"
            style={{
              background: isActive ? "#3A0CA3" : "#F5EEFE",
              color: isActive ? "#FFFFFF" : "#3D3552",
            }}
          >
            {/* {tab.icon ? `${tab.icon} ` : ""} */}
            {tab.name}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryTabs;
