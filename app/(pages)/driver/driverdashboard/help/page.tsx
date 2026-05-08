import DriverDashboardLayout from "@/app/components/drivercomponents/DriverDashboard/DriverDashboardLayout";

const HelpPage = () => {
    const faqs = [
        {
            question: 'How do I accept an order?',
            answer: 'Navigate to the Available Orders page and click the "Accept" button next to the order you want to accept.'
        },
        {
            question: 'When do I get paid?',
            answer: 'Payments are processed weekly every Friday. You can track your earnings on the Earnings page.'
        },
        {
            question: 'What if I have an issue with a delivery?',
            answer: 'Contact our support team immediately through the in-app chat or call our hotline at 1-800-DELIVER.'
        },
        {
            question: 'How can I update my vehicle information?',
            answer: 'Go to the My Vehicles page and click the "Edit" button on the vehicle you want to update.'
        }
    ];

    return (
        <DriverDashboardLayout>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Help Center</h2>
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Contact Support</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Live Chat</h4>
                            <p className="text-sm text-gray-600 mb-3">Chat with our support team in real-time</p>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Start Chat
                            </button>
                        </div>
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Call Us</h4>
                            <p className="text-sm text-gray-600 mb-3">Available 24/7 for urgent matters</p>
                            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                Call 1-800-DELIVER
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border rounded-lg p-4">
                                <details className="group">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                        <span>{faq.question}</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg
                                                fill="none"
                                                height="24"
                                                shapeRendering="geometricPrecision"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                viewBox="0 0 24 24"
                                                width="24"
                                            >
                                                <path d="M6 9l6 6 6-6"></path>
                                            </svg>
                                        </span>
                                    </summary>
                                    <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                                        {faq.answer}
                                    </p>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DriverDashboardLayout>
    );
};

export default HelpPage;