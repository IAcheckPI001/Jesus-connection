

import { useHomePage } from '../hooks/useHomePage';

function HomePage() {
  const { data, loading, error, refetch } = useHomePage();

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error.message} <button onClick={refetch}>Thử lại</button></p>;

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}

export default HomePage;