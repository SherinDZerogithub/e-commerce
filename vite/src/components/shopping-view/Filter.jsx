import { filterOptions } from "@/config";
import React, { Fragment } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { SlidersHorizontal } from "lucide-react";

export default function ProductFilter({ filter, handleFilters }) {
  return (
    <div className="bg-gradient-to-r from-[#36ab46] to-[rgb(62,211,102)] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 w-full max-w-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Product Filters
          </h2>
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-5 space-y-6">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-800 dark:text-gray-400">
                {keyItem}
              </h3>
              <div className="space-y-3">
                {filterOptions[keyItem].map((options) => (
                  <Label
                    key={options.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <Checkbox
                      className="h-5 w-5 rounded-md border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                      checked={
                        filter &&
                        Object.keys(filter).length > 0 &&
                        filter[keyItem] &&
                        filter[keyItem].indexOf(options.id) > -1
                      }
                      onCheckedChange={() => handleFilters(keyItem, options.id)}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {options.label}
                    </span>
                  </Label>
                ))}
              </div>
            </div>
            <Separator className="bg-gray-100 dark:bg-gray-800" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
