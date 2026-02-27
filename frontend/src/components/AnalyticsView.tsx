'use client';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import { TrendingUp, Package, DollarSign, Activity, Sparkles, AlertCircle } from 'lucide-react';

export default function AnalyticsView({ data }: { data: any }) {
    const { summary, forecast, recommendations } = data;

    const kpis = [
        { title: 'Total Sales', value: `$${summary.total_sales_value.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Total Profit', value: summary.total_profit_value ? `$${summary.total_profit_value.toLocaleString()}` : 'N/A', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Transactions', value: summary.total_transactions, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Top Product', value: Object.keys(summary.top_products)[0] || 'N/A', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    const topProductsData = Object.entries(summary.top_products).map(([name, value]) => ({
        name,
        sales: value
    }));

    const forecastData = forecast.forecast || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`${kpi.bg} p-3 rounded-lg`}>
                            <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Dynamic Category Breakdowns */}
                {Object.entries(summary.categorical_breakdowns || {}).map(([field, breakdown]: [string, any]) => (
                    <div key={field} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-800 capitalize">Sales by {field.replace(/_/g, ' ')}</h3>
                            <Package className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={breakdown}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}

                {/* Sales Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-6 text-gray-800">Monthly Sales Trend</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={summary.monthly_trends}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="total_sales" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-6 text-gray-800">Top Products by Sales</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProductsData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="sales" fill="#0284c7" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Forecasting */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800">30-Day Sales Forecast</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${forecast.confidence_indicator === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            Confidence: {forecast.confidence_indicator}
                        </span>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={forecastData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="predicted_sales" stroke="#0284c7" strokeWidth={3} dot={false} strokeDasharray="5 5" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="mt-4 text-sm text-gray-500 italic">Historical data is used to project future performance using linear regression.</p>
                </div>

                {/* AI Recommendations */}
                <div className="bg-primary-900 text-white p-6 rounded-xl shadow-2xl shadow-primary-900/40">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="h-6 w-6 text-primary-300" />
                        <h3 className="text-lg font-bold">AI Recommendations</h3>
                    </div>
                    <ul className="space-y-4">
                        {recommendations.map((rec: string, i: number) => (
                            <li key={i} className="flex gap-3 bg-white/10 p-4 rounded-lg border border-white/10 hover:bg-white/20 transition cursor-default group">
                                <AlertCircle className="h-5 w-5 text-primary-300 shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="text-sm leading-relaxed">{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
