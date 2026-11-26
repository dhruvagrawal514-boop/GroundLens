// Shared, in-memory app state. Replace with Supabase session data when the
// backend is connected (see src/lib/supabase.js).
export const state = {
  currentUser: null, // { name, email }
  currentRole: 'user', // 'user' (requester) or 'doer' (scout)
  currentDashView: 'dashboard',
};
