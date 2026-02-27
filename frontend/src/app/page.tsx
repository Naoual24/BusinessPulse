import Link from 'next/link';
import { BarChart3, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center" href="/">
                    <BarChart3 className="h-6 w-6 text-primary-600" />
                    <span className="ml-2 text-xl font-bold text-gray-900">BusinessPulse</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                        Login
                    </Link>
                    <Link className="text-sm font-medium bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700 transition" href="/signup">
                        Sign Up
                    </Link>
                </nav>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary-50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900">
                                    Smarter Analytics for Your Business
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Transform your sales data from Excel or CSV into beautiful dashboards, accurate forecasts, and actionable insights.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Link href="/signup" className="inline-flex h-10 items-center justify-center rounded-md bg-primary-600 px-8 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary-700">
                                    Get Started
                                </Link>
                                <Link href="#features" className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg shadow-sm">
                                <TrendingUp className="h-12 w-12 text-primary-600" />
                                <h2 className="text-xl font-bold">Sales Forecasting</h2>
                                <p className="text-gray-500 text-center">Predict your next month's sales with high accuracy using our built-in AI models.</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg shadow-sm">
                                <Zap className="h-12 w-12 text-primary-600" />
                                <h2 className="text-xl font-bold">Dynamic Dashboards</h2>
                                <p className="text-gray-500 text-center">Adaptive visualizations that grow with your data. See trends, top products, and more.</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg shadow-sm">
                                <ShieldCheck className="h-12 w-12 text-primary-600" />
                                <h2 className="text-xl font-bold">AI Recommendations</h2>
                                <p className="text-gray-500 text-center">Get intelligent tips on stock management, pricing, and growth opportunities.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t font-medium text-sm">
                <p className="text-gray-500">© 2024 BusinessPulse Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}
