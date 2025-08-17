import { Listbox } from '@headlessui/react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { ClienteSelectorProps } from '../interface/solicitudesInterface';

export default function ClienteSelector({ clientes, seleccionado, onChange }: ClienteSelectorProps) {
  const clienteActivo = clientes.find(c => c.id === seleccionado);

  return (
    <div className="w-full mb-6">
      <Listbox value={seleccionado} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full border border-gray-300 rounded px-4 py-2 text-left bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base">
            <span>{clienteActivo ? clienteActivo.nombre : "Clientes"}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronsUpDown className="w-4 h-4 text-gray-400" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto text-sm">
            {clientes.map((cliente) => (
              <Listbox.Option
                key={cliente.id}
                value={cliente.id}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 ${
                    active ? 'bg-primary text-white' : 'text-gray-900'
                  }`
                }
              >
                {({ selected }) => (
                  <div className="flex justify-between items-center">
                    <span className={selected ? 'font-medium' : 'font-normal'}>
                      {cliente.nombre}
                    </span>
                    {selected && <Check className="w-4 h-4 text-white" />}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
