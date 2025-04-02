import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'

interface Option<T> {
  value: T
  label: string
}

interface FilterDropdownProps<T> {
  label: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  darkMode?: boolean
}

export function FilterDropdown<T extends string>({ label, options, value, onChange, darkMode = false }: FilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find(option => option.value === value) || options[0]

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className={`relative w-full py-2 pl-3 pr-10 text-left rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm backdrop-blur-sm ${
            darkMode
              ? 'bg-gray-800/30 border-gray-700/50 text-gray-300'
              : 'bg-white/30 border-gray-200/50 text-gray-900'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block truncate">
            <span className="text-gray-500 mr-1">{label}:</span>
            {selectedOption.label}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={`absolute z-10 mt-1 w-full rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm backdrop-blur-md ${
              darkMode
                ? 'bg-gray-800/30 border border-gray-700/50 text-gray-300'
                : 'bg-white/30 border border-gray-200/50 text-gray-900'
            }`}
          >
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active
                      ? darkMode
                        ? 'bg-indigo-600/30 text-white'
                        : 'bg-indigo-50/30 text-indigo-600'
                      : ''
                  }`
                }
                value={option.value}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {option.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
} 