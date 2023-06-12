"use client";

import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState } from "react";

interface TimeZonePickerProps {
  selected?: string;
  onChange?: (timezone: string) => void;
}

const timeZones = Intl.supportedValuesOf("timeZone");

export default function TimeZonePicker({
  selected = Intl.DateTimeFormat().resolvedOptions().timeZone,
  onChange = () => {},
}: TimeZonePickerProps) {
  const [query, setQuery] = useState("");
  const [timeZone, setTimeZone] = useState(selected);

  const filteredTimeZones =
    query === ""
      ? timeZones
      : timeZones.filter((timeZone) => {
          return timeZone.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={timeZone}
      onChange={(value) => {
        setTimeZone(value);
        onChange(value);
      }}
    >
      <Combobox.Label className="block text-sm font-semibold leading-6 text-gray-600">
        Timezone
      </Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(timeZone: string) => timeZone}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
          <ChevronUpDownIcon
            className="w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredTimeZones.length > 0 && (
          <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredTimeZones.map((timeZone) => (
              <Combobox.Option
                key={timeZone}
                value={timeZone}
                className={({ active }) =>
                  clsx("relative cursor-default select-none py-2 pl-8 pr-4", {
                    "text-white bg-indigo-600": active,
                    "text-gray-900": !active,
                  })
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={clsx("block truncate", {
                        "font-semibold": selected,
                      })}
                    >
                      {timeZone}
                    </span>

                    {selected && (
                      <span
                        className={clsx(
                          "absolute inset-y-0 left-0 flex items-center pl-1.5",
                          {
                            "text-white": active,
                            "text-indigo-600": !active,
                          }
                        )}
                      >
                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
