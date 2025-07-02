export default function NotFound() {
  return (
    <main
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem' }}
    >
      <h1 style={{ fontSize: '5rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Такой страницы не существует</p>
      <a href="/" style={{ color: '#007bff', textDecoration: 'underline' }}>
        Вернуться на главную
      </a>
    </main>
  );
}
