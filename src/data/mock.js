// Placeholder data used until the Supabase tables are wired up.

// Mock notification data
export const notifications = [
    { id: 1, title: 'Task Accepted', message: 'Scout "Elena S." accepted your task "Verify Central Park Cafe"', time: '2 min ago', read: false, icon: 'fa-solid fa-check-circle', color: '#10b981' },
    { id: 2, title: 'Photo Uploaded', message: 'New verified photo for "Seattle Waterfront Check" is ready for review', time: '15 min ago', read: false, icon: 'fa-solid fa-camera', color: '#6366f1' },
    { id: 3, title: 'Payment Received', message: 'You received $25.00 for completing "Brooklyn Bridge Snap"', time: '1 hr ago', read: false, icon: 'fa-solid fa-dollar-sign', color: '#f59e0b' },
    { id: 4, title: 'New Scout Nearby', message: 'A new verified scout is now active in your area', time: '3 hrs ago', read: true, icon: 'fa-solid fa-user-plus', color: '#06b6d4' },
    { id: 5, title: 'Task Completed', message: '"Times Square Crowd Check" has been marked as complete', time: '5 hrs ago', read: true, icon: 'fa-solid fa-flag-checkered', color: '#a855f7' },
    { id: 6, title: 'System Update', message: 'GroundLens v2.4 is now live with faster GPS verification', time: '1 day ago', read: true, icon: 'fa-solid fa-rocket', color: '#ec4899' },
];

// Mock transaction data
export const transactions = [
    { id: 'TXN-3847', type: 'credit', desc: 'Task Payment - Central Park', amount: '+$25.00', date: 'Feb 28, 2026', status: 'Completed' },
    { id: 'TXN-3846', type: 'debit', desc: 'Task Posted - Seattle Pier', amount: '-$15.00', date: 'Feb 27, 2026', status: 'Completed' },
    { id: 'TXN-3845', type: 'credit', desc: 'Refund - Cancelled Task', amount: '+$10.00', date: 'Feb 26, 2026', status: 'Completed' },
    { id: 'TXN-3844', type: 'debit', desc: 'Task Posted - Brooklyn Bridge', amount: '-$20.00', date: 'Feb 25, 2026', status: 'Completed' },
    { id: 'TXN-3843', type: 'credit', desc: 'Task Payment - Wall Street', amount: '+$30.00', date: 'Feb 24, 2026', status: 'Completed' },
];

// Open tasks near the scout, positioned on the radar as percentages.
export const nearbyTasks = [
    { id: 'T-1042', title: 'Verify Central Park Cafe is open', distance: '0.4 km', bounty: 25, deadline: 'Today, 6:00 PM', media: 'Photo', x: 32, y: 40 },
    { id: 'T-1043', title: 'Queue length at Grand Station', distance: '1.1 km', bounty: 15, deadline: 'Today, 8:30 PM', media: 'Video', x: 68, y: 28 },
    { id: 'T-1044', title: 'Check parking near Pier 17', distance: '2.3 km', bounty: 20, deadline: 'Tomorrow, 10:00 AM', media: 'Photo', x: 58, y: 72 },
    { id: 'T-1045', title: 'Storefront condition on 5th Ave', distance: '3.0 km', bounty: 30, deadline: 'Tomorrow, 2:00 PM', media: 'Photo', x: 20, y: 75 },
];
