import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const TOKEN_KEY = 'admin_token';

const navItems = [
  { label: 'Overview', icon: 'dashboard' },
  { label: 'Products', icon: 'inventory_2' },
  { label: 'Testimonials', icon: 'reviews' },
  { label: 'Contacts', icon: 'mail' },
];

const statMeta = [
  { key: 'totalProducts', label: 'Products', icon: 'inventory_2' },
  { key: 'featuredProducts', label: 'Featured', icon: 'star' },
  { key: 'totalTestimonials', label: 'Testimonials', icon: 'chat' },
  { key: 'totalContacts', label: 'Messages', icon: 'inbox' },
];

function Admin() {
  const [email, setEmail] = useState('admin@portfolio.com');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const isAuthed = Boolean(token);
  const readyStats = useMemo(() => stats || {}, [stats]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem(TOKEN_KEY);
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  }, [token]);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token) return;

      setStatus('loading');
      setError('');

      try {
        const dashboardResponse = await axiosInstance.get('/dashboard');
        setStats(dashboardResponse.data.data);
        setStatus('ready');
      } catch (err) {
        setStatus('idle');
        setError(err?.response?.data?.message || 'Unable to load admin dashboard.');
      }
    };

    loadDashboard();
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token: sessionToken, admin: adminUser } = response.data.data;
      setToken(sessionToken);
      setAdmin(adminUser);
      setPassword('');
      setStatus('ready');
    } catch (err) {
      setStatus('idle');
      setError(err?.response?.data?.message || 'Login failed.');
    }
  };

  const handleLogout = () => {
    setToken('');
    setAdmin(null);
    setStats(null);
    setPassword('');
    setError('');
    setStatus('idle');
  };

  if (!isAuthed) {
    return (
      <main className="min-h-screen bg-background pt-28 pb-16 px-6 md:px-16 py-12">
        <section className="max-w-4xl mx-auto grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-8 md:p-10 shadow-sm">
            <span className="font-label-md uppercase tracking-[0.2em] text-secondary block mb-4">
              Admin Access
            </span>
            <h1 className="font-headline-xl text-primary mb-4">Manage the showroom from one place</h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl">
              Sign in to review dashboard totals, track inquiries, and move between products, testimonials,
              and site settings without leaving the backend context.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {navItems.map((item) => (
                <div key={item.label} className="rounded-xl border border-outline-variant/20 bg-surface p-4">
                  <span className="material-symbols-outlined text-secondary mb-3">{item.icon}</span>
                  <p className="font-label-md uppercase tracking-wider text-xs text-on-surface-variant">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-outline-variant/20 bg-surface p-8 shadow-sm">
            <h2 className="font-headline-md text-primary mb-2">Sign in</h2>
            <p className="text-on-surface-variant font-body-md mb-6">
              Use the admin credentials from your server `.env` file.
            </p>

            <form className="space-y-4" onSubmit={handleLogin}>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant/30 bg-background px-4 py-3 outline-none focus:border-secondary"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant/30 bg-background px-4 py-3 outline-none focus:border-secondary"
                />
              </label>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-full bg-primary px-5 py-3 text-on-primary font-label-md uppercase tracking-wider disabled:opacity-60"
              >
                {status === 'loading' ? 'Signing in...' : 'Open dashboard'}
              </button>
            </form>

            <div className="mt-8 rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
              Protected endpoints used here: <code>/api/auth/login</code> and <code>/api/dashboard</code>.
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-28 pb-16 px-6 md:px-16">
      <section className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="font-label-md uppercase tracking-[0.2em] text-secondary block mb-4">
              Admin Console
            </span>
            <h1 className="font-headline-xl text-primary mb-3">Backend overview</h1>
            <p className="text-on-surface-variant font-body-lg max-w-2xl">
              Signed in as {admin?.email || email}. This view reads from your live API and persists the session
              in the browser.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/"
              className="rounded-full border border-outline-variant/30 px-5 py-3 text-sm uppercase tracking-widest text-on-surface-variant"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-primary px-5 py-3 text-sm uppercase tracking-widest text-on-primary"
            >
              Sign out
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statMeta.map((item) => (
            <article
              key={item.key}
              className="rounded-2xl border border-outline-variant/20 bg-surface p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-secondary">{item.icon}</span>
                <span className="text-xs uppercase tracking-widest text-on-surface-variant">{item.label}</span>
              </div>
              <div className="text-4xl font-headline-md text-primary">
                {status === 'loading' ? '...' : readyStats[item.key] ?? 0}
              </div>
            </article>
          ))}
        </section>

        <section className="grid lg:grid-cols-12 gap-6 mt-8">
          <div className="lg:col-span-7 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6">
            <h2 className="font-headline-md text-primary mb-4">Session summary</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-surface-container-low px-4 py-4">
                <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Admin</p>
                <p className="font-body-lg text-primary">{admin?.email || email}</p>
              </div>
              <div className="rounded-xl bg-surface-container-low px-4 py-4">
                <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Token</p>
                <p className="font-body-lg text-primary">{token ? 'Stored locally' : 'Not saved'}</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-outline-variant/20 bg-background p-4">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">API connection</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-surface-container-low px-3 py-1">
                  <code>GET /api/dashboard</code>
                </span>
                <span className="rounded-full bg-surface-container-low px-3 py-1">
                  <code>POST /api/auth/login</code>
                </span>
                <span className="rounded-full bg-surface-container-low px-3 py-1">
                  <code>Bearer token</code>
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-outline-variant/20 bg-surface p-6">
            <h2 className="font-headline-md text-primary mb-4">Next controls</h2>
            <div className="space-y-3">
              <Link to="/products" className="block rounded-xl border border-outline-variant/20 px-4 py-3">
                Products catalog
              </Link>
              <Link to="/testimonials" className="block rounded-xl border border-outline-variant/20 px-4 py-3">
                Testimonials feed
              </Link>
              <Link to="/contact" className="block rounded-xl border border-outline-variant/20 px-4 py-3">
                Contact inbox
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Admin;
