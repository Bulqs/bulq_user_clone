// src/components/admin/AdminFooter.tsx
const AdminFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-appWhite border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                        {/* Copyright */}
                        <div className="text-center md:text-left">
                            <p className="text-sm font-semibold text-appTitleBgColor">
                                © {currentYear} BULQLOGISTICS. All rights reserved.
                            </p>
                        </div>

                        {/* System Status */}
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-appTitleBgColor">All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default AdminFooter;