import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { resolveImageUrl } from "../utils/imageUrl";

const TOKEN_KEY = "admin_token";
const emptyProduct = {
  name: "",
  shortDescription: "",
  description: "",
  category: "",
  material: "",
  availableColors: "",
  availableSizes: "",
  features: "",
  isFeatured: false,
  isActive: true,
};
const emptyTestimonial = {
  customerName: "",
  message: "",
  source: "Text",
  rating: "",
  isFeatured: false,
};
const inputClass =
  "mt-1 w-full rounded-lg border border-outline-variant/40 bg-background px-3 py-2.5 outline-none focus:border-secondary";
const adminSections = [
  ["overview", "Overview"],
  ["products", "Products"],
  ["testimonials", "Testimonials"],
  ["settings", "Brand settings"],
];

function Admin() {
  const [email, setEmail] = useState("admin@portfolio.com");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || "",
  );
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settingsForm, setSettingsForm] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [product, setProduct] = useState(emptyProduct);
  const [testimonial, setTestimonial] = useState(emptyTestimonial);
  const [productFiles, setProductFiles] = useState([]);
  const [testimonialFile, setTestimonialFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [
        dashboard,
        productResponse,
        testimonialResponse,
        settingsResponse,
      ] = await Promise.all([
        axiosInstance.get("/dashboard"),
        axiosInstance.get("/products/admin", {
          params: { limit: 100, activeOnly: "false" },
        }),
        axiosInstance.get("/testimonials", { params: { limit: 100 } }),
        axiosInstance.get("/settings"),
      ]);
      setStats(dashboard.data.data);
      setProducts(productResponse.data.data.products || []);
      setTestimonials(testimonialResponse.data.data || []);
      setSettingsForm(settingsResponse.data.data || {});
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load the admin data. Please sign in again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
      loadAdminData();
    } else {
      localStorage.removeItem(TOKEN_KEY);
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      setToken(response.data.data.token);
      setPassword("");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const data = new FormData();
      Object.entries(product).forEach(([key, value]) =>
        data.append(key, String(value)),
      );
      productFiles.forEach((file) => data.append("images", file));
      await axiosInstance.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProduct(emptyProduct);
      setProductFiles([]);
      setNotice("Product added successfully.");
      await loadAdminData();
      setTab("products");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not add the product.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestimonialSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const data = new FormData();
      Object.entries(testimonial).forEach(([key, value]) =>
        data.append(key, String(value)),
      );
      if (testimonialFile) data.append("image", testimonialFile);
      await axiosInstance.post("/testimonials", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTestimonial(emptyTestimonial);
      setTestimonialFile(null);
      setNotice("Testimonial added successfully.");
      await loadAdminData();
      setTab("testimonials");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not add the testimonial.",
      );
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (type, id) => {
    if (!window.confirm(`Delete this ${type.slice(0, -1)}?`)) return;
    setLoading(true);
    setError("");
    setNotice("");
    try {
      await axiosInstance.delete(`/${type}/${id}`);
      setNotice(`${type.slice(0, -1)} deleted.`);
      await loadAdminData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          `Could not delete the ${type.slice(0, -1)}.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = async (id, action) => {
    setLoading(true);
    setError("");
    try {
      await axiosInstance.patch(`/products/${id}/toggle-${action}`);
      await loadAdminData();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update product.");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const data = new FormData();
      [
        "businessName",
        "phone",
        "whatsapp",
        "email",
        "instagram",
        "address",
        "aboutText",
      ].forEach((key) => data.append(key, settingsForm[key] || ""));
      if (logoFile) data.append("logo", logoFile);
      if (heroFile) data.append("heroImage", heroFile);
      const response = await axiosInstance.put("/settings", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSettingsForm(response.data.data);
      setLogoFile(null);
      setHeroFile(null);
      setNotice("Brand details saved successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save brand details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New password and confirmation must match.");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setNotice("Password changed successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not change password.");
    } finally {
      setLoading(false);
    }
  };

  if (!token)
    return (
      <main className="min-h-screen bg-background px-6 pt-32 pb-16">
        <section className="mx-auto max-w-md rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-secondary">
            Admin access
          </span>
          <h1 className="mt-3 font-headline-xl text-primary">Sign in</h1>
          <p className="mt-3 text-on-surface-variant">
            Manage products and customer testimonials.
          </p>
          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <label>
              Email
              <input
                className={inputClass}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                className={inputClass}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <Message text={error} error />}
            <button
              className="w-full rounded-full bg-primary px-5 py-3 uppercase tracking-wider text-on-primary disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Open dashboard"}
            </button>
          </form>
        </section>
      </main>
    );

  return (
    <>
      <AdminNavigation
        tab={tab}
        setTab={setTab}
        onSignOut={() => setToken("")}
        clearMessages={() => {
          setNotice("");
          setError("");
        }}
      />
      <main className="min-h-screen bg-background px-6 pb-16 pt-40 md:px-16">
        <section className="mx-auto max-w-[1200px]">
          <div className="mb-10 flex flex-col gap-4 border-b border-outline-variant/20 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="font-label-md text-xs uppercase tracking-[0.2em] text-secondary">
                Studio management
              </span>
              <h1 className="mt-3 font-headline-xl text-primary">
                Manage your showroom
              </h1>
              <p className="mt-3 max-w-xl text-on-surface-variant">
                Keep the collection and the kind words behind it beautifully up
                to date.
              </p>
            </div>
            <p className="font-label-md text-xs uppercase tracking-[0.18em] text-on-surface-variant">
              {loading ? "Syncing your studio" : "Connected to your studio"}
            </p>
          </div>
          {error && <Message text={error} error />}
          {notice && <Message text={notice} />}
          {tab === "overview" && <Overview stats={stats} loading={loading} />}
          {tab === "products" && (
            <ProductList
              products={products}
              loading={loading}
              onToggle={toggleProduct}
              onDelete={(id) => removeItem("products", id)}
            />
          )}
          {tab === "add-product" && (
            <ProductForm
              product={product}
              setProduct={setProduct}
              files={productFiles}
              setFiles={setProductFiles}
              loading={loading}
              onSubmit={handleProductSubmit}
            />
          )}
          {tab === "testimonials" && (
            <TestimonialList
              testimonials={testimonials}
              loading={loading}
              onDelete={(id) => removeItem("testimonials", id)}
            />
          )}
          {tab === "add-testimonial" && (
            <TestimonialForm
              testimonial={testimonial}
              setTestimonial={setTestimonial}
              file={testimonialFile}
              setFile={setTestimonialFile}
              loading={loading}
              onSubmit={handleTestimonialSubmit}
            />
          )}
          {tab === "settings" && (
            <BrandSettings
              settings={settingsForm}
              setSettings={setSettingsForm}
              logoFile={logoFile}
              setLogoFile={setLogoFile}
              heroFile={heroFile}
              setHeroFile={setHeroFile}
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              loading={loading}
              onSettingsSubmit={handleSettingsSubmit}
              onPasswordSubmit={handlePasswordChange}
            />
          )}
        </section>
      </main>
    </>
  );
}

function AdminNavigation({ tab, setTab, onSignOut, clearMessages }) {
  const select = (nextTab) => {
    setTab(nextTab);
    clearMessages();
  };
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/15 bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-16">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/25 bg-secondary-container text-primary">
            <span className="material-symbols-outlined text-xl">
              content_cut
            </span>
          </span>
          <span>
            <span className="block font-headline-md text-primary italic">
              Lil' Threadz
            </span>
            <span className="block font-label-md text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
              Private atelier
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="hidden rounded-full px-3 py-2 font-label-md text-xs uppercase tracking-wider text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary sm:block"
          >
            View site
          </Link>
          <button
            className="rounded-full border border-outline-variant/30 px-3 py-2 font-label-md text-xs uppercase tracking-wider text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary"
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
      <div className="border-t border-outline-variant/10">
        <nav className="mx-auto flex max-w-[1200px] items-center gap-5 overflow-x-auto px-6 md:px-16">
          {adminSections.map(([id, label]) => (
            <button
              key={id}
              onClick={() => select(id)}
              className={`shrink-0 border-b-2 py-3 font-label-md text-xs uppercase tracking-[0.14em] transition ${tab === id ? "border-secondary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"}`}
            >
              {label}
            </button>
          ))}
          <span className="mx-1 h-4 w-px shrink-0 bg-outline-variant/40" />
          <button
            onClick={() => select("add-product")}
            className={`shrink-0 py-2 font-label-md text-xs uppercase tracking-[0.12em] transition ${tab === "add-product" ? "text-primary" : "text-secondary hover:text-primary"}`}
          >
            + Add product
          </button>
          <button
            onClick={() => select("add-testimonial")}
            className={`shrink-0 py-2 font-label-md text-xs uppercase tracking-[0.12em] transition ${tab === "add-testimonial" ? "text-primary" : "text-secondary hover:text-primary"}`}
          >
            + Add testimonial
          </button>
        </nav>
      </div>
    </header>
  );
}

function Message({ text, error = false }) {
  return (
    <div
      className={`mb-6 rounded-xl px-4 py-3 text-sm ${error ? "border border-red-200 bg-red-50 text-red-700" : "border border-green-200 bg-green-50 text-green-800"}`}
    >
      {text}
    </div>
  );
}
function Overview({ stats, loading }) {
  const items = [
    ["totalProducts", "Products"],
    ["featuredProducts", "Featured products"],
    ["totalTestimonials", "Testimonials"],
    ["totalContacts", "Messages"],
  ];
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map(([key, label]) => (
        <article
          key={key}
          className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-6"
        >
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">
            {label}
          </p>
          <p className="mt-3 font-headline-lg text-primary">
            {loading ? "…" : (stats?.[key] ?? 0)}
          </p>
        </article>
      ))}
    </section>
  );
}
function ProductList({ products, loading, onToggle, onDelete }) {
  return (
    <section className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5">
      <h2 className="font-headline-md text-primary">Products</h2>
      <div className="mt-5 space-y-3">
        {!loading && products.length === 0 && (
          <p className="text-on-surface-variant">No products yet.</p>
        )}
        {products.map((item) => (
          <article
            key={item._id}
            className="flex flex-col gap-3 rounded-xl border border-outline-variant/25 p-4 sm:flex-row sm:items-center"
          >
            {item.images?.[0]?.url ? (
              <img
                className="h-16 w-16 rounded-lg object-cover bg-surface-container"
                src={resolveImageUrl(item.images[0].url)}
                alt=""
              />
            ) : (
              <div className="h-16 w-16 rounded-lg bg-surface-container" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-primary">{item.name}</h3>
              <p className="text-sm text-on-surface-variant">
                {item.category} · {item.isActive ? "Active" : "Hidden"}{" "}
                {item.isFeatured ? "· Featured" : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-full border px-3 py-1.5 text-xs"
                onClick={() => onToggle(item._id, "active")}
              >
                {item.isActive ? "Hide" : "Show"}
              </button>
              <button
                className="rounded-full border px-3 py-1.5 text-xs"
                onClick={() => onToggle(item._id, "featured")}
              >
                {item.isFeatured ? "Unfeature" : "Feature"}
              </button>
              <button
                className="rounded-full border border-red-300 px-3 py-1.5 text-xs text-red-700"
                onClick={() => onDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
function ProductForm({
  product,
  setProduct,
  files,
  setFiles,
  loading,
  onSubmit,
}) {
  const update = (key, value) => setProduct({ ...product, [key]: value });
  return (
    <section className="max-w-4xl rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-6">
      <h2 className="font-headline-md text-primary">Add product</h2>
      <p className="mt-1 text-sm text-on-surface-variant">
        Add a complete product record and up to ten images.
      </p>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <Field
          label="Product name"
          value={product.name}
          onChange={(v) => update("name", v)}
          required
        />
        <Field
          label="Category"
          value={product.category}
          onChange={(v) => update("category", v)}
          required
        />
        <Field
          label="Short description"
          value={product.shortDescription}
          onChange={(v) => update("shortDescription", v)}
          required
        />
        <Field
          label="Material"
          value={product.material}
          onChange={(v) => update("material", v)}
        />
        <Field
          label="Colours (comma separated)"
          value={product.availableColors}
          onChange={(v) => update("availableColors", v)}
        />
        <Field
          label="Sizes (comma separated)"
          value={product.availableSizes}
          onChange={(v) => update("availableSizes", v)}
        />
        <Field
          label="Features (comma separated)"
          value={product.features}
          onChange={(v) => update("features", v)}
        />
        <label>
          Images
          <input
            className={inputClass}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 10))}
          />
          <span className="mt-1 block text-xs text-on-surface-variant">
            {files.length
              ? `${files.length} image(s) selected`
              : "Optional, maximum 10 images"}
          </span>
        </label>
        <label className="md:col-span-2">
          Full description
          <textarea
            className={inputClass}
            rows="5"
            value={product.description}
            onChange={(e) => update("description", e.target.value)}
            required
          />
        </label>
        <Checks values={product} update={update} active />
        <button
          className="md:col-span-2 rounded-full bg-primary px-5 py-3 text-on-primary disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Saving…" : "Add product"}
        </button>
      </form>
    </section>
  );
}
function TestimonialList({ testimonials, loading, onDelete }) {
  return (
    <section className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5">
      <h2 className="font-headline-md text-primary">Testimonials</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {!loading && testimonials.length === 0 && (
          <p className="text-on-surface-variant">No testimonials yet.</p>
        )}
        {testimonials.map((item) => (
          <article
            key={item._id}
            className="rounded-xl border border-outline-variant/25 p-4"
          >
            <div className="flex items-start gap-3">
              {item.image?.url && (
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={resolveImageUrl(item.image.url)}
                  alt=""
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-primary">
                  {item.customerName}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {item.source}
                  {item.rating ? ` · ${item.rating}/5` : ""}
                  {item.isFeatured ? " · Featured" : ""}
                </p>
              </div>
              <button
                className="text-xs text-red-700"
                onClick={() => onDelete(item._id)}
              >
                Delete
              </button>
            </div>
            <p className="mt-3 text-sm text-on-surface-variant">
              {item.message}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
function TestimonialForm({
  testimonial,
  setTestimonial,
  file,
  setFile,
  loading,
  onSubmit,
}) {
  const update = (key, value) =>
    setTestimonial({ ...testimonial, [key]: value });
  return (
    <section className="max-w-3xl rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-6">
      <h2 className="font-headline-md text-primary">Add testimonial</h2>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <Field
          label="Customer name"
          value={testimonial.customerName}
          onChange={(v) => update("customerName", v)}
          required
        />
        <label>
          Source
          <select
            className={inputClass}
            value={testimonial.source}
            onChange={(e) => update("source", e.target.value)}
          >
            {["Text", "WhatsApp", "Instagram DM", "Instagram Story"].map(
              (source) => (
                <option key={source}>{source}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Rating (optional)
          <input
            className={inputClass}
            type="number"
            min="1"
            max="5"
            value={testimonial.rating}
            onChange={(e) => update("rating", e.target.value)}
          />
        </label>
        <label>
          Customer image (optional)
          <input
            className={inputClass}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <span className="mt-1 block text-xs text-on-surface-variant">
            {file?.name || "No image selected"}
          </span>
        </label>
        <label className="md:col-span-2">
          Testimonial
          <textarea
            className={inputClass}
            rows="5"
            value={testimonial.message}
            onChange={(e) => update("message", e.target.value)}
            required
          />
        </label>
        <Checks values={testimonial} update={update} />
        <button
          className="md:col-span-2 rounded-full bg-primary px-5 py-3 text-on-primary disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Saving…" : "Add testimonial"}
        </button>
      </form>
    </section>
  );
}
function _LegacyBrandSettings({
  settings,
  setSettings,
  logoFile,
  setLogoFile,
  heroFile,
  setHeroFile,
  passwordForm,
  setPasswordForm,
  loading,
  onSettingsSubmit,
  onPasswordSubmit,
}) {
  const update = (key, value) => setSettings({ ...settings, [key]: value });
  const updatePassword = (key, value) =>
    setPasswordForm({ ...passwordForm, [key]: value });
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <section className="lg:col-span-8 rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-6">
        <span className="font-label-md text-xs uppercase tracking-[0.18em] text-secondary">
          Your public identity
        </span>
        <h2 className="mt-2 font-headline-md text-primary">Brand details</h2>
        <form
          className="mt-6 grid gap-4 md:grid-cols-2"
          onSubmit={onSettingsSubmit}
        >
          <Field
            label="Business name"
            value={settings.businessName || ""}
            onChange={(v) => update("businessName", v)}
            required
          />
          <Field
            label="Business email"
            value={settings.email || ""}
            onChange={(v) => update("email", v)}
            required
          />
          <Field
            label="Phone number"
            value={settings.phone || ""}
            onChange={(v) => update("phone", v)}
            required
          />
          <Field
            label="WhatsApp number"
            value={settings.whatsapp || ""}
            onChange={(v) => update("whatsapp", v)}
            required
          />
          <Field
            label="Instagram URL"
            value={settings.instagram || ""}
            onChange={(v) => update("instagram", v)}
          />
          <label>
            Logo
            <input
              className={inputClass}
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
            <span className="mt-1 block text-xs text-on-surface-variant">
              {logoFile?.name || "Upload a new logo (optional)"}
            </span>
          </label>
          <label>
            Hero image
            <input
              className={inputClass}
              type="file"
              accept="image/*"
              onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
            />
            <span className="mt-1 block text-xs text-on-surface-variant">
              {heroFile?.name || "Upload a new hero image (optional)"}
            </span>
          </label>
          <label className="md:col-span-2">
            Address
            <textarea
              className={inputClass}
              rows="2"
              value={settings.address || ""}
              onChange={(e) => update("address", e.target.value)}
            />
          </label>
          <label className="md:col-span-2">
            About text
            <textarea
              className={inputClass}
              rows="5"
              value={settings.aboutText || ""}
              onChange={(e) => update("aboutText", e.target.value)}
            />
          </label>
          <button
            className="md:col-span-2 rounded-full bg-primary px-5 py-3 text-on-primary disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Saving…" : "Save brand details"}
          </button>
        </form>
      </section>
      <section className="lg:col-span-4 h-fit rounded-2xl border border-outline-variant/25 bg-surface-container-low p-6">
        <span className="material-symbols-outlined text-secondary">lock</span>
        <h2 className="mt-3 font-headline-md text-primary">Password</h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Change your sign-in password without using an emergency recovery
          secret.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onPasswordSubmit}>
          <label>
            Current password
            <input
              className={inputClass}
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                updatePassword("currentPassword", e.target.value)
              }
              required
            />
          </label>
          <label>
            New password
            <input
              className={inputClass}
              type="password"
              minLength="8"
              value={passwordForm.newPassword}
              onChange={(e) => updatePassword("newPassword", e.target.value)}
              required
            />
          </label>
          <label>
            Confirm new password
            <input
              className={inputClass}
              type="password"
              minLength="8"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                updatePassword("confirmPassword", e.target.value)
              }
              required
            />
          </label>
          <button
            className="w-full rounded-full border border-primary px-4 py-3 font-label-md text-xs uppercase tracking-wider text-primary disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Saving…" : "Change password"}
          </button>
        </form>
      </section>
    </div>
  );
}
function BrandSettings({
  settings,
  setSettings,
  logoFile,
  setLogoFile,
  heroFile,
  setHeroFile,
  passwordForm,
  setPasswordForm,
  loading,
  onSettingsSubmit,
  onPasswordSubmit,
}) {
  const update = (key, value) => setSettings({ ...settings, [key]: value });
  const updatePassword = (key, value) =>
    setPasswordForm({ ...passwordForm, [key]: value });
  const logoUrl = resolveImageUrl(settings.logo?.url);
  const heroUrl = resolveImageUrl(settings.heroImage?.url);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-outline-variant/20 bg-surface-container-lowest">
        <div className="border-b border-outline-variant/15 bg-surface-container-low px-6 py-7 md:px-8">
          <span className="font-label-md text-xs uppercase tracking-[0.2em] text-secondary">
            Site-wide settings
          </span>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-headline-lg text-primary">
                Your brand, in one place
              </h2>
              <p className="mt-2 max-w-2xl text-on-surface-variant">
                These details appear across the header, contact links, about
                page, and customer messages.
              </p>
            </div>
            <span className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant">
              Changes publish on save
            </span>
          </div>
        </div>
        <form className="p-6 md:p-8" onSubmit={onSettingsSubmit}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8 lg:col-span-8">
              <section>
                <SectionTitle
                  number="01"
                  title="Identity"
                  description="The name and visuals that introduce your atelier."
                />
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <SettingInput
                    label="Business name"
                    value={settings.businessName || ""}
                    onChange={(v) => update("businessName", v)}
                    required
                  />
                  <SettingInput
                    label="Business email"
                    type="email"
                    value={settings.email || ""}
                    onChange={(v) => update("email", v)}
                    required
                  />
                </div>
              </section>
              <section className="border-t border-outline-variant/15 pt-8">
                <SectionTitle
                  number="02"
                  title="Contact & social"
                  description="Use an international number for WhatsApp, without spaces if possible."
                />
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <SettingInput
                    label="Phone number"
                    value={settings.phone || ""}
                    onChange={(v) => update("phone", v)}
                    required
                  />
                  <SettingInput
                    label="WhatsApp number"
                    value={settings.whatsapp || ""}
                    onChange={(v) => update("whatsapp", v)}
                    required
                  />
                  <SettingInput
                    label="Instagram URL"
                    value={settings.instagram || ""}
                    onChange={(v) => update("instagram", v)}
                    className="md:col-span-2"
                  />
                </div>
              </section>
              <section className="border-t border-outline-variant/15 pt-8">
                <SectionTitle
                  number="03"
                  title="Your story"
                  description="Give visitors the essential context behind your work."
                />
                <div className="mt-5 space-y-4">
                  <label className="block font-label-md text-xs uppercase tracking-widest text-on-surface-variant">
                    Address
                    <textarea
                      className={`${inputClass} min-h-20`}
                      rows="2"
                      value={settings.address || ""}
                      onChange={(e) => update("address", e.target.value)}
                    />
                  </label>
                  <label className="block font-label-md text-xs uppercase tracking-widest text-on-surface-variant">
                    About text
                    <textarea
                      className={`${inputClass} min-h-36`}
                      rows="5"
                      value={settings.aboutText || ""}
                      onChange={(e) => update("aboutText", e.target.value)}
                    />
                  </label>
                </div>
              </section>
            </div>
            <aside className="space-y-5 lg:col-span-4">
              <section className="rounded-2xl border border-outline-variant/20 bg-surface p-5">
                <p className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant">
                  Visual identity
                </p>
                <div className="mt-5 space-y-5">
                  <AssetPickerLogo
                    label="Logo"
                    description="Square works best"
                    currentUrl={logoUrl}
                    file={logoFile}
                    onFileChange={setLogoFile}
                    variant="logo"
                  />
                  <AssetPicker
                    label="Hero image"
                    description="Wide landscape works best"
                    currentUrl={heroUrl}
                    file={heroFile}
                    onFileChange={setHeroFile}
                    variant="hero"
                  />
                </div>
              </section>
              {/* <div className="rounded-2xl bg-primary p-5 text-on-primary">
                <span className="material-symbols-outlined text-secondary-container">
                  auto_awesome
                </span>
                <p className="mt-3 font-headline-md">
                  A consistent first impression.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-on-primary/70">
                  Your saved logo and hero image are served directly from the
                  backend on public pages.
                </p>
              </div> */}
            </aside>
          </div>
          <div className="mt-8 flex justify-end border-t border-outline-variant/15 pt-6">
            <button
              className="rounded-full bg-primary px-6 py-3 font-label-md text-xs uppercase tracking-wider text-on-primary transition hover:opacity-85 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Saving…" : "Save brand details"}
            </button>
          </div>
        </form>
      </section>
      <section className="grid gap-6 rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6 lg:grid-cols-2 lg:p-8">
        {/* Info Header Area */}
        <div className="lg:col-span-4">
          <span className="material-symbols-outlined text-secondary">lock</span>
          <h2 className="mt-3 font-headline-md text-primary">
            Account security
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            Set a fresh sign-in password here. Your current password is required
            to protect the account.
          </p>
        </div>

        {/* Responsive Form Grid */}
        <form
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:items-end lg:col-span-8"
          onSubmit={onPasswordSubmit}
        >
          <SettingInput
            label="Current password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(v) => updatePassword("currentPassword", v)}
            required
          />
          <SettingInput
            label="New password"
            type="password"
            value={passwordForm.newPassword}
            onChange={(v) => updatePassword("newPassword", v)}
            required
          />
          <SettingInput
            label="Confirm password"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(v) => updatePassword("confirmPassword", v)}
            required
          />

          {/* Dynamic Layout Button Container */}
          <div className="sm:col-span-1 lg:col-span-3 flex justify-end mt-2 sm:mt-0">
            <button
              className="w-full sm:w-auto rounded-full border border-primary px-5 py-3 font-label-md text-xs uppercase tracking-wider text-primary transition hover:bg-primary hover:text-on-primary disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Saving…" : "Change password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function SectionTitle({ number, title, description }) {
  return (
    <div>
      <span className="font-label-md text-xs uppercase tracking-[0.18em] text-secondary">
        {number}
      </span>
      <h3 className="mt-1 font-headline-md text-primary">{title}</h3>
      <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
    </div>
  );
}
function SettingInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
}) {
  return (
    <label
      className={`block font-label-md text-xs uppercase tracking-widest text-on-surface-variant ${className}`}
    >
      {label}
      <input
        className={inputClass}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </label>
  );
}
function AssetPickerLogo({
  label,
  description,
  currentUrl,
  file,
  onFileChange,
  variant,
}) {
  return (
    <label className="group block cursor-pointer">
      <span className="flex items-center justify-between font-label-md text-xs uppercase tracking-widest text-on-surface-variant">
        <span>{label}</span>
        <span className="normal-case tracking-normal opacity-70">
          {description}
        </span>
      </span>

      {/* Dynamic layout wrapper based on variant */}
      <div
        className={`mt-2 flex ${variant === "hero" ? "flex-col gap-2" : "flex-row items-center gap-3"}`}
      >
        {/* Preview Bounding Box */}
        <div
          className={`overflow-hidden rounded-xl border border-dashed border-outline-variant/50 bg-background transition-colors group-hover:border-primary/50 shrink-0 ${
            variant === "hero"
              ? "w-full aspect-[16/7]"
              : "w-14 sm:w-16 aspect-square"
          }`}
        >
          {currentUrl ? (
            <img
              src={currentUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-outline-variant transition-colors group-hover:text-primary/70">
              <span className="material-symbols-outlined text-xl">
                add_photo_alternate
              </span>
            </div>
          )}
        </div>

        {/* File Name Label */}
        <span className="block text-xs text-secondary transition-colors group-hover:text-primary truncate max-w-xs">
          {file?.name || "Choose image"}
        </span>
      </div>

      <input
        className="sr-only"
        type="file"
        accept="image/*"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      />
    </label>
  );
}
function AssetPicker({
  label,
  description,
  currentUrl,
  file,
  onFileChange,
  variant,
}) {
  return (
    <label className="block cursor-pointer">
      <span className="flex items-center justify-between font-label-md text-xs uppercase tracking-widest text-on-surface-variant">
        <span>{label}</span>
        <span className="normal-case tracking-normal">{description}</span>
      </span>
      <div
        className={`mt-2 overflow-hidden rounded-xl border border-dashed border-outline-variant/50 bg-background ${variant === "hero" ? "aspect-[16/7]" : "aspect-square max-w-28"}`}
      >
        {currentUrl ? (
          <img src={currentUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-outline-variant">
            <span className="material-symbols-outlined">
              add_photo_alternate
            </span>
          </div>
        )}
      </div>
      <input
        className="sr-only"
        type="file"
        accept="image/*"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      />
      <span className="mt-2 block text-xs text-secondary">
        {file?.name || "Choose image"}
      </span>
    </label>
  );
}
function Field({ label, value, onChange, required = false }) {
  return (
    <label>
      {label}
      <input
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </label>
  );
}
function Checks({ values, update, active = false }) {
  return (
    <div className="flex flex-wrap gap-5 md:col-span-2">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={values.isFeatured}
          onChange={(e) => update("isFeatured", e.target.checked)}
        />
        Featured
      </label>
      {active && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => update("isActive", e.target.checked)}
          />
          Visible on site
        </label>
      )}
    </div>
  );
}

export default Admin;
