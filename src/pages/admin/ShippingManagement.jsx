import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getShippingRules, saveShippingRules } from "../../services/dataStore";
import {
  Truck, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Save, AlertCircle, CheckCircle, Loader2, ChevronDown
} from "lucide-react";

const FIXED_STATES = ["Andhra Pradesh", "Telangana"];

const defaultDistrictEntry = { charge: 60, active: true };

// Format district charge safely
const fmtCharge = (v) => {
  const n = Number(v);
  return isNaN(n) ? "—" : `\u20b9${n}`;
};

const ShippingManagement = () => {
  const [rules, setRules] = useState(null);
  const [activeState, setActiveState] = useState("Andhra Pradesh");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [addForm, setAddForm] = useState({ show: false, stateName: "", district: "", charge: "" });
  const [editTarget, setEditTarget] = useState(null); // { stateName, district }
  const [editCharge, setEditCharge] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getShippingRules();
        setRules(data);
      } catch {
        setRules({ defaultCharge: 80, states: {} });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      await saveShippingRules(rules);
      setSaveStatus("success");
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const updateGlobalDefault = (val) => {
    setRules((prev) => ({ ...prev, defaultCharge: Number(val) || 0 }));
  };

  const updateStateDefault = (stateName, val) => {
    setRules((prev) => ({
      ...prev,
      states: {
        ...prev.states,
        [stateName]: {
          ...(prev.states?.[stateName] || {}),
          defaultCharge: Number(val) || 0,
        },
      },
    }));
  };

  const toggleDistrict = (stateName, district) => {
    setRules((prev) => {
      const stateData = prev.states?.[stateName] || {};
      const distData = stateData.districts?.[district] || {};
      return {
        ...prev,
        states: {
          ...prev.states,
          [stateName]: {
            ...stateData,
            districts: {
              ...(stateData.districts || {}),
              [district]: { ...distData, active: !distData.active },
            },
          },
        },
      };
    });
  };

  const deleteDistrict = (stateName, district) => {
    if (!window.confirm(`Delete district rule for "${district}"?`)) return;
    setRules((prev) => {
      const stateData = prev.states?.[stateName] || {};
      const newDistricts = { ...(stateData.districts || {}) };
      delete newDistricts[district];
      return {
        ...prev,
        states: {
          ...prev.states,
          [stateName]: { ...stateData, districts: newDistricts },
        },
      };
    });
  };

  const startEdit = (stateName, district) => {
    const charge = rules?.states?.[stateName]?.districts?.[district]?.charge || 0;
    setEditTarget({ stateName, district });
    setEditCharge(String(charge));
  };

  const commitEdit = () => {
    if (!editTarget) return;
    const { stateName, district } = editTarget;
    setRules((prev) => {
      const stateData = prev.states?.[stateName] || {};
      const distData = stateData.districts?.[district] || {};
      return {
        ...prev,
        states: {
          ...prev.states,
          [stateName]: {
            ...stateData,
            districts: {
              ...(stateData.districts || {}),
              [district]: { ...distData, charge: Number(editCharge) || 0 },
            },
          },
        },
      };
    });
    setEditTarget(null);
    setEditCharge("");
  };

  const handleAddDistrict = () => {
    const { stateName, district, charge } = addForm;
    if (!stateName || !district.trim()) return;
    setRules((prev) => {
      const stateData = prev.states?.[stateName] || {};
      return {
        ...prev,
        states: {
          ...prev.states,
          [stateName]: {
            ...stateData,
            districts: {
              ...(stateData.districts || {}),
              [district.trim()]: { charge: Number(charge) || 0, active: true },
            },
          },
        },
      };
    });
    setAddForm({ show: false, stateName: "", district: "", charge: "" });
  };

  const getStateDisplayNames = () => {
    const extra = Object.keys(rules?.states || {}).filter((s) => !FIXED_STATES.includes(s));
    return [...FIXED_STATES, ...extra, "Other States"];
  };

  const getDistrictsForState = (stateName) => {
    if (stateName === "Other States") return null;
    return rules?.states?.[stateName]?.districts || {};
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-brand-gold" />
      </div>
    );
  }

  const stateDisplayNames = getStateDisplayNames();
  const activeDistricts = getDistrictsForState(activeState);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-brand-cream flex items-center gap-3">
            <Truck size={24} className="text-brand-gold" /> Shipping Management
          </h2>
          <p className="text-brand-cream/50 text-sm mt-1">
            Configure district-wise delivery charges. PIN code \u2192 State \u2192 District \u2192 Charge.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === "success" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold"
            >
              <CheckCircle size={13} /> Saved successfully
            </motion.span>
          )}
          {saveStatus === "error" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold"
            >
              <AlertCircle size={13} /> Save failed
            </motion.span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-black text-sm font-bold hover:bg-amber-400 transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {/* Global Default Charge */}
      <div className="bg-brand-matte rounded-3xl border border-white/10 p-6">
        <h3 className="text-sm font-bold text-brand-cream/70 uppercase tracking-widest mb-4">
          Global Default Charge (Other States / Unknown)
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-brand-cream/60 text-sm">All unlisted states:</span>
          <div className="flex items-center gap-2">
            <span className="text-brand-cream text-sm">\u20b9</span>
            <input
              type="number"
              min="0"
              value={rules?.defaultCharge ?? 80}
              onChange={(e) => updateGlobalDefault(e.target.value)}
              className="w-24 bg-brand-black border border-white/20 rounded-xl px-3 py-2 text-brand-cream text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
        </div>
        <p className="text-xs text-brand-cream/40 mt-2">
          Applied when the customer&apos;s state or district is not listed in any specific rule.
        </p>
      </div>

      {/* State Tabs */}
      <div className="bg-brand-matte rounded-3xl border border-white/10 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-white/10 custom-scrollbar">
          {stateDisplayNames.map((stateName) => (
            <button
              key={stateName}
              onClick={() => setActiveState(stateName)}
              className={`px-5 py-4 text-sm font-semibold whitespace-nowrap shrink-0 transition-all border-b-2 -mb-px ${
                activeState === stateName
                  ? "text-brand-gold border-brand-gold bg-brand-gold/5"
                  : "text-brand-cream/50 border-transparent hover:text-brand-cream/80"
              }`}
            >
              {stateName}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeState === "Other States" ? (
            /* Other States panel */
            <div>
              <p className="text-sm text-brand-cream/60 mb-4">
                The global default charge applies to all states not explicitly listed. You can also add a new state with its districts using the button below.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-brand-cream/60 text-sm">Global default:</span>
                <span className="text-brand-gold font-bold">\u20b9{rules?.defaultCharge ?? 80}</span>
              </div>
              <button
                onClick={() => setAddForm({ show: true, stateName: "__new__", district: "", charge: "" })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-sm font-semibold hover:bg-brand-gold/25 transition-all"
              >
                <Plus size={14} /> Add New State + District
              </button>

              {addForm.show && addForm.stateName === "__new__" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-brand-black rounded-2xl border border-white/10 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-brand-cream/50 mb-1 uppercase">State Name</label>
                      <input
                        placeholder="e.g. Karnataka"
                        value={addForm.stateName === "__new__" ? "" : addForm.stateName}
                        onChange={(e) => setAddForm((p) => ({ ...p, stateName: e.target.value }))}
                        className="w-full bg-brand-matte border border-white/20 rounded-xl px-3 py-2 text-brand-cream text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-brand-cream/50 mb-1 uppercase">District Name</label>
                      <input
                        placeholder="e.g. Bengaluru"
                        value={addForm.district}
                        onChange={(e) => setAddForm((p) => ({ ...p, district: e.target.value }))}
                        className="w-full bg-brand-matte border border-white/20 rounded-xl px-3 py-2 text-brand-cream text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-brand-cream/50 mb-1 uppercase">Charge (\u20b9)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="80"
                        value={addForm.charge}
                        onChange={(e) => setAddForm((p) => ({ ...p, charge: e.target.value }))}
                        className="w-full bg-brand-matte border border-white/20 rounded-xl px-3 py-2 text-brand-cream text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleAddDistrict} className="px-4 py-2 rounded-xl bg-brand-gold text-brand-black text-xs font-bold hover:bg-amber-400 transition-all">
                      Add
                    </button>
                    <button onClick={() => setAddForm({ show: false, stateName: "", district: "", charge: "" })} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-brand-cream/60 text-xs hover:bg-white/10 transition-all">
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Named State panel */
            <div className="space-y-5">
              {/* State default charge */}
              <div className="flex flex-wrap items-center gap-4 pb-5 border-b border-white/10">
                <span className="text-sm font-bold text-brand-cream">{activeState} Default Charge</span>
                <span className="text-brand-cream/50 text-xs">(used when district not listed or rule inactive)</span>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-brand-cream/60 text-sm">\u20b9</span>
                  <input
                    type="number"
                    min="0"
                    value={rules?.states?.[activeState]?.defaultCharge ?? 70}
                    onChange={(e) => updateStateDefault(activeState, e.target.value)}
                    className="w-24 bg-brand-black border border-white/20 rounded-xl px-3 py-2 text-brand-cream text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>
              </div>

              {/* District table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-brand-cream/50 uppercase tracking-widest">
                    District Rules ({Object.keys(activeDistricts || {}).length})
                  </h4>
                  <button
                    onClick={() => setAddForm({ show: true, stateName: activeState, district: "", charge: "" })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-bold hover:bg-brand-gold/25 transition-all"
                  >
                    <Plus size={12} /> Add District
                  </button>
                </div>

                {/* Add district form */}
                <AnimatePresence>
                  {addForm.show && addForm.stateName === activeState && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-4 bg-brand-black rounded-2xl border border-brand-gold/20 overflow-hidden"
                    >
                      <p className="text-xs font-bold text-brand-gold mb-3">Add District Rule for {activeState}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-brand-cream/50 mb-1 uppercase">District Name</label>
                          <input
                            placeholder="e.g. East Godavari"
                            value={addForm.district}
                            onChange={(e) => setAddForm((p) => ({ ...p, district: e.target.value }))}
                            className="w-full bg-brand-matte border border-white/20 rounded-xl px-3 py-2 text-brand-cream text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-brand-cream/50 mb-1 uppercase">Charge (\u20b9)</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="60"
                            value={addForm.charge}
                            onChange={(e) => setAddForm((p) => ({ ...p, charge: e.target.value }))}
                            className="w-full bg-brand-matte border border-white/20 rounded-xl px-3 py-2 text-brand-cream text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <button onClick={handleAddDistrict} className="flex-1 py-2 rounded-xl bg-brand-gold text-brand-black text-xs font-bold hover:bg-amber-400 transition-all">
                            Add
                          </button>
                          <button onClick={() => setAddForm({ show: false, stateName: "", district: "", charge: "" })} className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-brand-cream/60 text-xs hover:bg-white/10 transition-all">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* District rows */}
                {Object.keys(activeDistricts || {}).length === 0 ? (
                  <p className="text-brand-cream/40 text-sm text-center py-8">
                    No district rules added yet. Click &quot;Add District&quot; to create one.
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-white/10">
                    <table className="min-w-full text-sm">
                      <thead className="border-b border-white/10">
                        <tr>
                          {["District", "Delivery Charge", "Status", "Actions"].map((h) => (
                            <th key={h} className="py-3 px-4 text-left text-[10px] uppercase tracking-widest text-brand-cream/30 font-bold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(activeDistricts || {}).sort(([a], [b]) => a.localeCompare(b)).map(([district, data]) => (
                          <motion.tr
                            key={district}
                            layout
                            className="border-b border-white/5 hover:bg-white/3 transition-colors"
                          >
                            <td className="py-3 px-4 text-brand-cream font-medium">{district}</td>
                            <td className="py-3 px-4">
                              {editTarget?.stateName === activeState && editTarget?.district === district ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-brand-cream/60">\u20b9</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={editCharge}
                                    onChange={(e) => setEditCharge(e.target.value)}
                                    autoFocus
                                    className="w-20 bg-brand-black border border-brand-gold rounded-lg px-2 py-1 text-brand-cream text-sm font-bold focus:outline-none"
                                  />
                                  <button onClick={commitEdit} className="text-emerald-400 hover:text-emerald-300">
                                    <CheckCircle size={14} />
                                  </button>
                                </div>
                              ) : (
                                <span className={`font-bold font-mono ${data?.active !== false ? "text-brand-gold" : "text-brand-cream/30"}`}>
                                  {fmtCharge(data?.charge)}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => toggleDistrict(activeState, district)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase transition-all ${
                                  data?.active !== false
                                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                    : "bg-white/5 text-brand-cream/30 border-white/10"
                                }`}
                              >
                                {data?.active !== false ? (
                                  <><ToggleRight size={11} /> Active</>
                                ) : (
                                  <><ToggleLeft size={11} /> Inactive</>
                                )}
                              </button>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => startEdit(activeState, district)}
                                  className="p-1.5 rounded-lg bg-brand-gold/15 text-brand-gold hover:bg-brand-gold/25 transition-all"
                                  title="Edit charge"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  onClick={() => deleteDistrict(activeState, district)}
                                  className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 transition-all"
                                  title="Delete rule"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info banner */}
      <div className="p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-2xl text-xs text-brand-cream/60 space-y-1.5">
        <p className="font-bold text-brand-gold text-sm">Charge Priority Logic</p>
        <p>1. <strong>District rule (active)</strong> \u2192 exact district charge</p>
        <p>2. <strong>State default</strong> \u2192 if district not listed or rule is inactive</p>
        <p>3. <strong>Global default</strong> \u2192 if state is not listed at all</p>
        <p className="pt-1 text-brand-cream/40">All charges are re-verified server-side during order creation. Customers cannot manipulate them.</p>
      </div>
    </div>
  );
};

export default ShippingManagement;
