'use client';

import { useState } from 'react';
import { Plus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

const INITIAL_FIELDS = [
    { key: 'date', label: 'Date', required: true, type: 'date' },
    { key: 'product', label: 'Product Name', required: true, type: 'text' },
    { key: 'quantity', label: 'Quantity Sold', required: true, type: 'number' },
    { key: 'price', label: 'Unit Price', required: true, type: 'number' },
];

export default function MappingDialog({ columns, onComplete }: { columns: string[], onComplete: (mapping: any) => void }) {
    const [fields, setFields] = useState<any[]>(INITIAL_FIELDS);
    const [mapping, setMapping] = useState<any>({});
    const [customFieldLabel, setCustomFieldLabel] = useState('');

    const handleSelect = (fieldKey: string, colName: string) => {
        setMapping({ ...mapping, [fieldKey]: colName });
    };

    const addCustomField = () => {
        if (!customFieldLabel.trim()) return;
        const key = customFieldLabel.toLowerCase().replace(/\s+/g, '_');
        if (fields.find(f => f.key === key)) {
            alert("This field already exists");
            return;
        }
        setFields([...fields, { key, label: customFieldLabel, required: false, type: 'dynamic' }]);
        setCustomFieldLabel('');
    };

    const removeField = (key: string) => {
        if (INITIAL_FIELDS.find(f => f.key === key)) return;
        setFields(fields.filter(f => f.key !== key));
        const newMapping = { ...mapping };
        delete newMapping[key];
        setMapping(newMapping);
    };

    const isComplete = fields.filter(f => f.required).every(f => !!mapping[f.key]);

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-primary-900 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Configure Your Dashboard</h2>
                <p className="text-primary-100 opacity-80">
                    Match your file columns to the fields you want to analyze. You can also add custom fields for specific client needs.
                </p>
            </div>

            <div className="p-8">
                <div className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.key} className="group animate-in slide-in-from-left-4 duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-900 text-lg capitalize">
                                            {field.label}
                                        </p>
                                        {field.required ? (
                                            <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Required</span>
                                        ) : (
                                            <button
                                                onClick={() => removeField(field.key)}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                                                title="Remove field"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {field.type === 'date' ? 'Used for timeline charts' :
                                            field.type === 'number' ? 'Used for sales & totals' :
                                                'Used for category breakdowns'}
                                    </p>
                                </div>

                                <div className="min-w-[300px]">
                                    <select
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none shadow-sm font-semibold transition-all appearance-none cursor-pointer"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
                                        onChange={(e) => handleSelect(field.key, e.target.value)}
                                        value={mapping[field.key] || ''}
                                        aria-label={`Select column for ${field.label}`}
                                    >
                                        <option value="" className="text-gray-400 font-normal">-- Select a column from file --</option>
                                        {columns.map(col => (
                                            <option key={col} value={col} className="font-medium text-gray-700">{col}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Custom Field Section */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Plus className="h-5 w-5 text-primary-600" />
                        Add Client-Specific Field
                    </h3>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="e.g., Region, Sales Agent, Category..."
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                            value={customFieldLabel}
                            onChange={(e) => setCustomFieldLabel(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addCustomField()}
                        />
                        <button
                            onClick={addCustomField}
                            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            Add Field
                        </button>
                    </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 text-sm font-medium">
                        {isComplete ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <ShieldCheck className="h-5 w-5" />
                                <span>Perfect! All required fields are matched.</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-orange-600">
                                <AlertCircle className="h-5 w-5" />
                                <span>Please match all required fields (*) to continue.</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => onComplete(mapping)}
                        disabled={!isComplete}
                        className="w-full sm:w-auto bg-primary-600 text-white px-10 py-4 rounded-xl font-black shadow-xl shadow-primary-500/20 hover:bg-primary-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 transition-all uppercase tracking-wider text-sm"
                    >
                        Generate Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
