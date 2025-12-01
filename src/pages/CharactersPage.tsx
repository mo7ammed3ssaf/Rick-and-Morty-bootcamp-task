import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Character = {
  id: number;
  image: string;
  name: string;
  species: string;
  status: string;
};

type Info = {
  prev?: string | null;
  next?: string | null;
};

export default function CharactersPage() {
  const [state, setState] = useState<{ search: string; loading: boolean; error: string }>({
    search: "",
    loading: false,
    error: "",
  });
  const [page, setPage] = useState<number>(1);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [info, setInfo] = useState<Info | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setState((s) => ({ ...s, loading: true, error: "" }));
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        if (state.search) params.set("name", state.search);
        const res = await fetch(`https://rickandmortyapi.com/api/character?${params.toString()}`);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        if (cancelled) return;
        setCharacters(data.results || []);
        setInfo({ prev: data.info?.prev ?? null, next: data.info?.next ?? null });
      } catch (e: any) {
        if (!cancelled) setState((s) => ({ ...s, error: e?.message ?? "Failed to load" }));
      } finally {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [page, state.search]);

  function onSearchChange(v: string) {
    setState((s) => ({ ...s, search: v }));
    setPage(1);
  }

  return (
    <div>
      <h2>Characters</h2>
      <SearchInput value={state.search} onChange={onSearchChange} />

      {state.loading && <p>Loading...</p>}
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}

      <ul className="grid">
        {characters.map((c) => (
          <li key={c.id} className="card">
            <Link to={`/character/${c.id}`}>
              <img src={c.image} alt={c.name} />
              <div className="card-body">
                <strong>{c.name}</strong>
                <div>
                  {c.species} — {c.status}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button disabled={!info?.prev} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        <span>Page {page}</span>
        <button disabled={!info?.next} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <input
        placeholder="Search characters by name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: 8, width: "100%", maxWidth: 400 }}
      />
    </div>
  );
}
