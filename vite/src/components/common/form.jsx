import { Input } from "../ui/input";
import { Label } from "../ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Button } from "../ui/button";
import { useState } from "react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  function renderInputsByComponentType(getControllItem) {
    let element = null;
    const value = formData[getControllItem.name] || "";

    switch (getControllItem.componentType) {
      case "input":
        if (getControllItem.type === "password") {
          element = (
            <div className="relative">
              <Input
                name={getControllItem.name}
                placeholder={getControllItem.placeholder}
                id={getControllItem.name}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControllItem.name]: event.target.value,
                  })
                }
                className="pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>
          );
        } else {
          element = (
            <Input
              name={getControllItem.name}
              placeholder={getControllItem.placeholder}
              id={getControllItem.name}
              type={getControllItem.type}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControllItem.name]: event.target.value,
                })
              }
            />
          );
        }
        break;

      case "textarea":
        element = (
          <textarea
            name={getControllItem.name}
            placeholder={getControllItem.placeholder}
            id={getControllItem.name}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControllItem.name]: event.target.value,
              })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  "
            rows={4}
          />
        );
        break;

      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, [getControllItem.name]: value })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControllItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControllItem.options && getControllItem.options.length > 0
                ? getControllItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      default:
        element = (
          <Input
            name={getControllItem.name}
            placeholder={getControllItem.placeholder}
            id={getControllItem.name}
            type={getControllItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControllItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }
    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
