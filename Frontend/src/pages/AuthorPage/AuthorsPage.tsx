import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthorsPage.css';

interface Author {
  id: number;
  name: string;
  profileImagePath: string;
}

const AuthorsPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);

  const fetchAuthors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/authors');
      if (!response.ok) {
        throw new Error('Error fetching authors');
      }
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
      alert('Error fetching authors');
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return (
    <div className="authors-page">
      <h1>Yazarlar</h1>
      <div className="authors-grid">
        {authors.length === 0 ? (
          <p>No authors available.</p>
        ) : (
          authors.map((author) => (
            <Link
              to={`/author/${author.id}`}
              key={author.id}
              className="author-card text-decoration-none text-dark"
            >
              <div className="author-card">
                <img
                  src={`http://localhost:5000/${author.profileImagePath}`}
                  alt={author.name}
                  className="author-image"
                />
                <h3 className="author-name">{author.name}</h3>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default AuthorsPage;
