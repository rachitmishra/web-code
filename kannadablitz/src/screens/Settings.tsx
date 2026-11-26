import { useMemo, useRef, useState } from "react";
import { go } from "../app/router";
import type { Topic } from "../content/schema";
import { exportPack, isBuiltin } from "../content/registry";
import { validatePack, type ValidationReport } from "../content/validate";
import { TOPIC_LABEL } from "../engine/curriculum";
import { artPrompt } from "../engine/illustration";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { Art, Modal, Native } from "../ui/kit";

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return <button type="button" className={`switch ${on ? "on" : ""}`} aria-pressed={on} aria-label={label} onClick={onClick} />;
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Settings() {
  const { state, update, packs, pack, selectPack, importPackJson, deletePack, reset, sync } = useEngine();
  const [report, setReport] = useState<(ValidationReport & { id?: string }) | null>(null);
  const [paste, setPaste] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [restoreKey, setRestoreKey] = useState("");
  const [syncMsg, setSyncMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<typeof state.settings>) => update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));

  const runImport = (text: string) => setReport(importPackJson(text));

  const copyTag = () => {
    if (!sync.tag) return;
    void navigator.clipboard?.writeText(sync.tag);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 1600);
  };

  const handleEnableSync = async () => {
    setSyncMsg(null);
    const res = await sync.enable();
    if (res.ok && res.tag) setSyncMsg({ ok: true, text: `Cloud sync active! Save your key: ${res.tag}` });
    else if (res.error) setSyncMsg({ ok: false, text: res.error });
  };

  const handleSyncNow = async () => {
    setSyncMsg(null);
    const res = await sync.syncNow();
    if (res.ok) setSyncMsg({ ok: true, text: "Progress and settings synced to cloud." });
    else if (res.error) setSyncMsg({ ok: false, text: res.error });
  };

  const handleRestore = async () => {
    if (!restoreKey.trim()) return;
    setSyncMsg(null);
    const res = await sync.restore(restoreKey);
    if (res.ok && res.tag) {
      setRestoreKey("");
      setShowRestore(false);
      setSyncMsg({ ok: true, text: `Restored journal for ${res.tag}.` });
    } else if (res.error) {
      setSyncMsg({ ok: false, text: res.error });
    }
  };

  return (
    <div className="stack lg" style={{ maxWidth: 760 }}>
      <header><span className="eyebrow">Settings</span><h1>Your journal</h1></header>

      <section className="card stack" aria-label="Cloud sync">
        <div className="row between wrap">
          <div>
            <h3>Cloud sync</h3>
            <p className="muted" style={{ fontSize: 13 }}>Sync your progress, stamps, postcards, and settings across devices with your unique key.</p>
          </div>
          {sync.tag && (
            <span className={`tag ${sync.status === "error" ? "terracotta" : sync.status === "syncing" ? "saffron" : "leaf"}`}>
              {sync.status === "syncing" ? "Syncing…" : sync.status === "error" ? "Sync error" : "Synced"}
            </span>
          )}
        </div>

        {sync.tag ? (
          <>
            <div className="sync-key-box">
              <div className="stack" style={{ gap: 2, minWidth: 0 }}>
                <span className="eyebrow">Your sync key</span>
                <strong className="sync-key-code">{sync.tag}</strong>
                {sync.lastSyncedAt && (
                  <span className="muted" style={{ fontSize: 12 }}>
                    Last synced {new Date(sync.lastSyncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
              <button type="button" className="btn sm" onClick={copyTag}>
                <Icon name={copiedKey ? "check" : "copy"} /> {copiedKey ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="row wrap" style={{ gap: 8 }}>
              <button type="button" className="btn primary sm" disabled={sync.status === "syncing"} onClick={() => void handleSyncNow()}>
                <Icon name="refresh" /> {sync.status === "syncing" ? "Syncing…" : "Sync now"}
              </button>
              <button type="button" className="btn sm" onClick={() => setShowRestore((v) => !v)}>
                Switch key
              </button>
              <button type="button" className="btn sm ghost" onClick={() => { sync.disconnect(); setSyncMsg(null); }}>
                Disconnect
              </button>
            </div>
          </>
        ) : (
          <div className="row wrap" style={{ gap: 10 }}>
            <button type="button" className="btn primary" disabled={sync.status === "syncing"} onClick={() => void handleEnableSync()}>
              <Icon name="upload" /> {sync.status === "syncing" ? "Creating key…" : "Enable cloud sync"}
            </button>
            <button type="button" className="btn" onClick={() => setShowRestore((v) => !v)}>
              Restore with key
            </button>
          </div>
        )}

        {showRestore && (
          <div className="row wrap" style={{ gap: 8 }}>
            <input
              className="input"
              style={{ flex: "1 1 200px" }}
              value={restoreKey}
              onChange={(e) => setRestoreKey(e.target.value)}
              placeholder="e.g. asha#4829"
              aria-label="Sync key"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
            <button type="button" className="btn ink" disabled={sync.status === "syncing" || !restoreKey.trim()} onClick={() => void handleRestore()}>
              Restore
            </button>
          </div>
        )}

        {(syncMsg || sync.error) && (
          <p role="status" style={{ fontSize: 13, fontWeight: 700, color: syncMsg?.ok ? "var(--leaf)" : "var(--danger)" }}>
            {syncMsg?.text ?? sync.error}
          </p>
        )}
      </section>

      <section className="card">
        <h3>Learner</h3>
        <div className="setting-row">
          <label htmlFor="nm"><strong>Name on postcards</strong></label>
          <input id="nm" className="input" style={{ maxWidth: 240 }} value={state.learner.name} maxLength={40} onChange={(e) => update((s) => ({ ...s, learner: { ...s.learner, name: e.target.value } }))} />
        </div>
        <div className="setting-row">
          <div><strong>Daily goal</strong><p className="muted" style={{ fontSize: 13 }}>XP per day for your goal ring</p></div>
          <div className="row" style={{ gap: 6 }}>
            {[20, 50, 100, 150].map((g) => <button key={g} type="button" className={`chip ${state.learner.goalXp === g ? "active" : ""}`} onClick={() => update((s) => ({ ...s, learner: { ...s.learner, goalXp: g } }))}>{g}</button>)}
          </div>
        </div>
      </section>

      <section className="card">
        <h3>Appearance</h3>
        <div className="setting-row">
          <div>
            <strong>Theme</strong>
            <p className="muted" style={{ fontSize: 13 }}>
              {(state.settings.theme ?? "studio") === "studio"
                ? "Kala Studio: crisp alabaster, Liquid Glass chrome & bold tactile cards"
                : "Sandalwood Glass: warm sandalwood ivory & classic Liquid Glass"}
            </p>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button
              type="button"
              className={`chip ${(state.settings.theme ?? "studio") === "studio" ? "active" : ""}`}
              aria-pressed={(state.settings.theme ?? "studio") === "studio"}
              onClick={() => set({ theme: "studio" })}
            >
              Kala Studio
            </button>
            <button
              type="button"
              className={`chip ${state.settings.theme === "glass" ? "active" : ""}`}
              aria-pressed={state.settings.theme === "glass"}
              onClick={() => set({ theme: "glass" })}
            >
              Sandalwood Glass
            </button>
          </div>
        </div>
      </section>

      <section className="card">
        <h3>Learning</h3>
        <div className="setting-row"><div><strong>Lives</strong><p className="muted" style={{ fontSize: 13 }}>Turn off to practise without penalties</p></div><Toggle on={state.settings.livesEnabled} label="Lives" onClick={() => set({ livesEnabled: !state.settings.livesEnabled })} /></div>
        <div className="setting-row">
          <div><strong>Maximum lives</strong></div>
          <div className="row" style={{ gap: 6 }}>{[3, 5, 7].map((n) => <button key={n} type="button" className={`chip ${state.settings.maxLives === n ? "active" : ""}`} onClick={() => update((s) => ({ ...s, settings: { ...s.settings, maxLives: n }, lives: { ...s.lives, count: Math.min(n, s.lives.count) } }))}>{n}</button>)}</div>
        </div>
        <div className="setting-row"><div><strong>Show romanisation</strong><p className="muted" style={{ fontSize: 13 }}>{pack.config.romanisation}. Hide it to rely on the script alone.</p></div><Toggle on={state.settings.showRoman} label="Show romanisation" onClick={() => set({ showRoman: !state.settings.showRoman })} /></div>
        {pack.phonetics && <div className="setting-row"><div><strong>English pronunciation hints</strong><p className="muted" style={{ fontSize: 13 }}>Shows simplified English phonetics like "namaskaara" so you can read and say words comfortably</p></div><Toggle on={state.settings.showPhonetics} label="English pronunciation hints" onClick={() => set({ showPhonetics: !state.settings.showPhonetics })} /></div>}
        <div className="setting-row"><div><strong>Pronunciation audio</strong><p className="muted" style={{ fontSize: 13 }}>Uses your device's {pack.config.name} voice. If there isn't one, the English pronunciation is read aloud instead.</p></div><Toggle on={state.settings.sound} label="Audio" onClick={() => set({ sound: !state.settings.sound })} /></div>
        <div className="setting-row"><div><strong>Reduce motion</strong></div><Toggle on={state.settings.reducedMotion} label="Reduce motion" onClick={() => set({ reducedMotion: !state.settings.reducedMotion })} /></div>
        <div className="setting-row"><div><strong>Debug UI labels</strong><p className="muted" style={{ fontSize: 13 }}>Overlay screen and component names for UI inspection (shortcut: Alt+D)</p></div><Toggle on={!!state.settings.debug} label="Debug UI labels" onClick={() => set({ debug: !state.settings.debug })} /></div>
      </section>

      <section className="card stack">
        <div className="row between"><h3>Languages</h3><button type="button" className="btn sm" onClick={() => go({ name: "content" })}><Icon name="settings" /> Content studio</button></div>
        {Object.values(packs).map((p) => (
          <div key={p.config.id} className={`option-card ${p.config.id === pack.config.id ? "active" : ""}`}>
            <span className="native" lang={p.config.id} style={{ fontSize: 28, minWidth: 80, textAlign: "center", fontFamily: p.config.fontFamily }}>{p.config.nativeName}</span>
            <span className="stack" style={{ gap: 2, flex: 1 }}>
              <strong>{p.config.name} <span className="muted" style={{ fontWeight: 600, fontSize: 12 }}>v{p.config.version}</span></strong>
              <span className="muted" style={{ fontSize: 12 }}>{p.levels.length} levels · {p.vocab.length} words · {isBuiltin(p.config.id) ? "built-in" : "imported"}</span>
            </span>
            {p.config.id === pack.config.id ? <span className="tag leaf">Active</span> : <button type="button" className="btn sm" onClick={() => selectPack(p.config.id)}>Switch</button>}
            {!isBuiltin(p.config.id) && <button type="button" className="icon-btn" aria-label={`Remove ${p.config.name}`} onClick={() => deletePack(p.config.id)}><Icon name="trash" /></button>}
          </div>
        ))}
        <p className="muted" style={{ fontSize: 13 }}>Progress is kept separately for each language.</p>
        <hr className="divider" />
        <h3>Import a language pack</h3>
        <p className="muted" style={{ fontSize: 13 }}>A pack is a JSON file in the same schema as the built-in ones (config, letters, vocab, phrases, sentences, levels, postcards). It is validated before it's added. For safety, imported packs can't include raw SVG artwork.</p>
        <div className="row wrap">
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) runImport(await f.text()); e.target.value = ""; }} />
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}><Icon name="upload" /> Choose file</button>
          <button type="button" className="btn" onClick={() => download(`${pack.config.id}-pack-v${pack.config.version}.json`, exportPack(pack))}><Icon name="download" /> Export active pack</button>
        </div>
        <textarea className="textarea" placeholder="…or paste pack JSON here" value={paste} onChange={(e) => setPaste(e.target.value)} aria-label="Pack JSON" />
        <button type="button" className="btn ink" style={{ alignSelf: "flex-start" }} disabled={!paste.trim()} onClick={() => runImport(paste)}>Validate &amp; import</button>
        {report && <ReportView r={report} onUse={report.id ? () => selectPack(report.id!) : undefined} />}
      </section>

      <section className="card stack">
        <h3>Data</h3>
        <p className="muted" style={{ fontSize: 13 }}>Progress is saved in this browser only.</p>
        <button type="button" className="btn" style={{ alignSelf: "flex-start", borderColor: "var(--danger)", color: "var(--danger)" }} onClick={() => setConfirmReset(true)}><Icon name="trash" /> Reset all progress</button>
      </section>

      {confirmReset && (
        <Modal label="Reset progress" onClose={() => setConfirmReset(false)}>
          <div className="stack" style={{ textAlign: "center" }}>
            <h2>Reset everything?</h2>
            <p className="muted">This deletes all stamps, postcards, streaks and word history in every language. It can't be undone.</p>
            <button type="button" className="btn block" onClick={() => setConfirmReset(false)}>Cancel</button>
            <button type="button" className="btn primary block" onClick={() => { reset(); setConfirmReset(false); go({ name: "home" }); }}>Yes, reset</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ReportView({ r, onUse }: { r: ValidationReport; onUse?: () => void }) {
  return (
    <div className="card warm stack" role="status">
      <strong style={{ color: r.ok ? "var(--leaf)" : "var(--danger)" }}><Icon name={r.ok ? "check" : "x"} /> {r.ok ? "Pack is valid" : "Pack has problems"}</strong>
      {Object.keys(r.stats).length > 0 && <span className="muted" style={{ fontSize: 13 }}>{Object.entries(r.stats).map(([k, v]) => `${v} ${k}`).join(" · ")}</span>}
      {r.errors.map((e) => <span key={e} style={{ color: "var(--danger)", fontSize: 13 }}>• {e}</span>)}
      {r.warnings.slice(0, 8).map((w) => <span key={w} className="muted" style={{ fontSize: 13 }}>• {w}</span>)}
      {r.warnings.length > 8 && <span className="muted" style={{ fontSize: 13 }}>…and {r.warnings.length - 8} more warnings</span>}
      {r.ok && onUse && <button type="button" className="btn leaf sm" style={{ alignSelf: "flex-start" }} onClick={onUse}>Switch to this pack</button>}
    </div>
  );
}

/** Content management: validation, curriculum explorer and illustration management. */
export function ContentStudio() {
  const { pack, curriculum, art, artOverrides, setArtOverride } = useEngine();
  const [tab, setTab] = useState<"vocab" | "curriculum" | "validate">("vocab");
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [page, setPage] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const report = useMemo(() => validatePack(pack), [pack]);
  const fileFor = useRef<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const topics = useMemo(() => [...new Set(pack.vocab.map((v) => v.topic))].sort(), [pack]);
  const rows = pack.vocab.filter((v) => (topic === "all" || v.topic === topic) && (!q || v.script.includes(q) || v.meaning.toLowerCase().includes(q.toLowerCase()) || v.roman.toLowerCase().includes(q.toLowerCase())));
  const PER = 25;

  const upload = (file: File, vocabId: string) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      // downscale to keep storage small; store as PNG data URL (never SVG)
      const size = 256;
      const c = document.createElement("canvas");
      c.width = size; c.height = size;
      const ctx = c.getContext("2d")!;
      const s = Math.max(size / img.width, size / img.height);
      ctx.drawImage(img, (size - img.width * s) / 2, (size - img.height * s) / 2, img.width * s, img.height * s);
      setArtOverride(vocabId, { src: c.toDataURL("image/png") });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="stack lg">
      <button type="button" className="btn sm ghost" style={{ alignSelf: "flex-start" }} onClick={() => go({ name: "settings" })}><Icon name="arrowLeft" /> Settings</button>
      <header><span className="eyebrow">Content studio · {pack.config.name} v{pack.config.version}</span><h1>Language pack</h1>
        <p className="muted">Content lives in the pack, not the app, so words, art and levels can be updated without a new release.</p></header>
      <div className="grid four">
        {Object.entries(report.stats).map(([k, v]) => <div key={k} className="card stat"><b>{v}</b><span>{k}</span></div>)}
        <div className="card stat"><b>{curriculum.totals.sublevels}</b><span>sublevels</span></div>
        <div className="card stat"><b>{curriculum.totals.exercises}</b><span>exercises</span></div>
      </div>
      <div className="row wrap" style={{ gap: 6 }} role="tablist">
        {(["vocab", "curriculum", "validate"] as const).map((t) => <button key={t} type="button" role="tab" aria-selected={tab === t} className={`chip ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t === "vocab" ? "Vocabulary & art" : t === "curriculum" ? "Curriculum" : `Validation ${report.ok ? "✓" : "✗"}`}</button>)}
      </div>

      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f && fileFor.current) upload(f, fileFor.current); e.target.value = ""; }} />

      {tab === "vocab" && (
        <section className="card stack">
          <div className="row wrap">
            <input className="input" style={{ maxWidth: 280 }} placeholder="Search script, meaning or romanisation" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} aria-label="Search vocabulary" />
            <select className="select" style={{ maxWidth: 200 }} value={topic} onChange={(e) => { setTopic(e.target.value as Topic | "all"); setPage(0); }} aria-label="Topic">
              <option value="all">All topics</option>
              {topics.map((t) => <option key={t} value={t}>{TOPIC_LABEL[t]}</option>)}
            </select>
            <span className="muted" style={{ fontSize: 13 }}>{rows.length} entries</span>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Art</th><th>Script</th><th>Meaning</th><th>Topic</th><th>Lesson</th><th>Illustration</th></tr></thead>
              <tbody>
                {rows.slice(page * PER, page * PER + PER).map((v) => {
                  const a = art(v);
                  const o = artOverrides[pack.config.id]?.[v.id];
                  return (
                    <tr key={v.id}>
                      <td><Art vocab={v} size={48} /></td>
                      <td><Native size={18}>{v.script}</Native><div className="roman" style={{ fontSize: 12 }}>{v.roman}</div></td>
                      <td>{v.meaning}<div className="faint" style={{ fontSize: 11 }}>{v.pos} · {v.source}</div></td>
                      <td>{TOPIC_LABEL[v.topic]}</td>
                      <td>{v.lesson}</td>
                      <td>
                        <div className="row wrap" style={{ gap: 4 }}>
                          <span className={`tag ${a.kind === "img" ? "sky" : a.kind === "svg" ? "leaf" : "saffron"}`}>{a.kind === "img" ? "uploaded" : a.kind === "svg" ? "bespoke" : "motif"}</span>
                          <button type="button" className="btn sm ghost" title="Upload replacement" onClick={() => { fileFor.current = v.id; fileRef.current?.click(); }}><Icon name="upload" /></button>
                          <button type="button" className="btn sm ghost" title="Regenerate motif" onClick={() => setArtOverride(v.id, { variant: (o?.variant ?? 0) + 1, src: null })}><Icon name="refresh" /></button>
                          <button type="button" className="btn sm ghost" title="Copy generation prompt" onClick={() => { void navigator.clipboard?.writeText(artPrompt(v, pack.config.name)); setCopied(v.id); setTimeout(() => setCopied(null), 1500); }}>
                            <Icon name={copied === v.id ? "check" : "image"} />
                          </button>
                          {o && <button type="button" className="btn sm ghost" title="Reset" onClick={() => setArtOverride(v.id, { src: null, variant: 0 })}><Icon name="x" /></button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="row between">
            <button type="button" className="btn sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><Icon name="arrowLeft" /></button>
            <span className="muted" style={{ fontSize: 13 }}>Page {page + 1} of {Math.max(1, Math.ceil(rows.length / PER))}</span>
            <button type="button" className="btn sm" disabled={(page + 1) * PER >= rows.length} onClick={() => setPage((p) => p + 1)}><Icon name="arrowRight" /></button>
          </div>
          <p className="muted" style={{ fontSize: 12 }}>The image button copies an art-direction prompt built from the word's metadata, so a generator produces art in the same house style. Upload the result to replace the motif. It's stored per word and reused by every exercise.</p>
        </section>
      )}

      {tab === "curriculum" && (
        <section className="stack">
          {curriculum.levels.map((l) => (
            <details key={l.number} className="card">
              <summary style={{ cursor: "pointer", fontWeight: 800 }}>Level {l.number} · {l.title} <span className="muted" style={{ fontWeight: 600 }}>({l.mode}, {l.vocabIds.length} words)</span></summary>
              <div className="table-wrap"><table className="data" style={{ marginTop: 10 }}>
                <thead><tr><th>#</th><th>Sublevel</th><th>Kind</th><th>Exercise plan</th></tr></thead>
                <tbody>{l.sublevels.map((s) => (
                  <tr key={s.id}><td>{s.index}</td><td>{s.title}</td><td>{s.kind}</td><td style={{ fontSize: 11 }} className="muted">{s.plan.map((p) => p.type.replace("_", " ")).join(" → ")}</td></tr>
                ))}</tbody>
              </table></div>
            </details>
          ))}
        </section>
      )}

      {tab === "validate" && <ReportView r={report} />}
    </div>
  );
}
