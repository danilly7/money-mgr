import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#ff0000' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.2rem' }}>Sorry, we couldn't find the page you're looking for.</p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '1.1rem',
          backgroundColor: '#4CAF50',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '5px',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
      >
        Go to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
