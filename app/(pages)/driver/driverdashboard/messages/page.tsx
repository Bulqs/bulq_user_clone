"use client";
import DriverDashboardLayout from "@/app/components/drivercomponents/DriverDashboard/DriverDashboardLayout";
import { useState } from 'react';
import { Search, Filter, MoreVertical, MessageCircle, User, Clock, Check, CheckCheck, Paperclip, Mic, Send } from 'lucide-react';

interface Message {
    id: string;
    sender: string;
    senderRole: string;
    message: string;
    timestamp: string;
    unread: boolean;
    attachments?: boolean;
}

interface Conversation {
    id: string;
    contact: string;
    role: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    online: boolean;
    messages: Message[];
}

const MessagesPage = () => {
    const [activeConversation, setActiveConversation] = useState<string>('conv1');
    const [newMessage, setNewMessage] = useState('');

    const conversations: Conversation[] = [
        {
            id: 'conv1',
            contact: 'Dispatch Center',
            role: 'Operations',
            lastMessage: 'Your delivery to 123 Main St has been confirmed',
            timestamp: '2 min ago',
            unread: 2,
            online: true,
            messages: [
                {
                    id: '1',
                    sender: 'Dispatch Center',
                    senderRole: 'Operations',
                    message: 'Hello John, you have a new delivery assignment',
                    timestamp: '10:30 AM',
                    unread: false
                },
                {
                    id: '2',
                    sender: 'You',
                    senderRole: 'Driver',
                    message: 'Received. What\'s the delivery address?',
                    timestamp: '10:32 AM',
                    unread: false
                },
                {
                    id: '3',
                    sender: 'Dispatch Center',
                    senderRole: 'Operations',
                    message: '123 Main St, Downtown. Priority delivery.',
                    timestamp: '10:33 AM',
                    unread: false
                },
                {
                    id: '4',
                    sender: 'Dispatch Center',
                    senderRole: 'Operations',
                    message: 'Your delivery to 123 Main St has been confirmed',
                    timestamp: '10:35 AM',
                    unread: true,
                    attachments: true
                }
            ]
        },
        {
            id: 'conv2',
            contact: 'Sarah Wilson',
            role: 'Logistics Manager',
            lastMessage: 'Please update the delivery status when you arrive',
            timestamp: '1 hour ago',
            unread: 0,
            online: false,
            messages: []
        },
        {
            id: 'conv3',
            contact: 'Mike Johnson',
            role: 'Fleet Supervisor',
            lastMessage: 'Vehicle maintenance scheduled for tomorrow',
            timestamp: '3 hours ago',
            unread: 0,
            online: true,
            messages: []
        },
        {
            id: 'conv4',
            contact: 'Customer Support',
            role: 'Support Team',
            lastMessage: 'Your recent query has been resolved',
            timestamp: '1 day ago',
            unread: 0,
            online: false,
            messages: []
        }
    ];

    const activeConv = conversations.find(conv => conv.id === activeConversation);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // Here you would typically send the message to your backend
            setNewMessage('');
        }
    };

    return (
        <DriverDashboardLayout>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Messages</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Stay connected with your team</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                    {/* Conversations List */}
                    <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                />
                            </div>
                        </div>

                        <div className="overflow-y-auto h-[calc(100%-80px)]">
                            {conversations.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    onClick={() => setActiveConversation(conversation.id)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${activeConversation === conversation.id ? 'bg-appTitleBgColor/10' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                {conversation.contact.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            {conversation.online && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h6 className="font-semibold text-gray-800 truncate">
                                                    {conversation.contact}
                                                </h6>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {conversation.timestamp}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate mb-1">
                                                {conversation.lastMessage}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">{conversation.role}</span>
                                                {conversation.unread > 0 && (
                                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                        {conversation.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                        {activeConv ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {activeConv.contact.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                {activeConv.online && (
                                                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{activeConv.contact}</h3>
                                                <p className="text-sm text-gray-500">{activeConv.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                                    <div className="space-y-4">
                                        {activeConv.messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.sender === 'You'
                                                            ? 'bg-appTitleBgColor text-white rounded-br-none'
                                                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                                        }`}
                                                >
                                                    {message.sender !== 'You' && (
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-sm">{message.sender}</span>
                                                            <span className="text-xs text-gray-500">{message.senderRole}</span>
                                                        </div>
                                                    )}
                                                    <p className="text-sm">{message.message}</p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs opacity-70">
                                                            {message.timestamp}
                                                        </span>
                                                        {message.sender === 'You' && (
                                                            <div className="flex items-center gap-1">
                                                                {message.unread ? (
                                                                    <Check className="w-3 h-3" />
                                                                ) : (
                                                                    <CheckCheck className="w-3 h-3" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t border-gray-200 bg-white">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Paperclip className="w-5 h-5" />
                                        </button>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Type a message..."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                            />
                                        </div>
                                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Mic className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim()}
                                            className="p-2 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No conversation selected</h3>
                                    <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DriverDashboardLayout>
    );
};

export default MessagesPage;