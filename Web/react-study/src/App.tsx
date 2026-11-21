function MovieTitle() {
  return <h2>오디세이</h2>;
}

function MovieCard() {
  return (
    <article>
      <MovieTitle />
      <p>2026.08.05</p>
    </article>
  );
}

export default function App() {
  return (
    <main>
      <h1>영화 목록</h1>
      <MovieCard />
    </main>
  );
}