import { filterOptions } from "@/config";
import React, { Fragment } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

export default function ProductFilter({ filter, handleFilters }) {
  return (
    <div className="bg-background rounded-lg shadow-sm ">
      <div className=" p-4 border-b ">
        <h2 className="text-lg font-extrabold">Filter</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold"> {keyItem} </h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((options) => (
                  <Label
                    key={options.id}
                    className="flex items-center gap-2 font-medium"
                  >
                    <Checkbox
                      checked={
                        filter &&
                        Object.keys(filter).length > 0 &&
                        filter[keyItem] &&
                        filter[keyItem].indexOf(options.id) > -1
                      }
                      onCheckedChange={() => handleFilters(keyItem, options.id)}
                    />
                    {options.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
