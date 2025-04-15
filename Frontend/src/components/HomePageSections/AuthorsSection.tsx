import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './AuthorSection.css';

interface Author {
  id: number;
  name: string;
  profileImagePath: string;
}

const AuthorsSection: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/authors?limit=5&sort=desc')
      .then((response) => response.json())
      .then((data) => setAuthors(data))
      .catch((error) => console.error('Error fetching authors:', error));
  }, []);

  return (
    <div className="container my-5 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Yazarlar</h2>
        <Link to="/authors" className="btn btn-link text-decoration-none" style={{color: "rgb(118,187,175"}}>
          Tümünü Gör →
        </Link>
      </div>
        <div className="authors-scroll-container" ref={scrollContainerRef}>
          {authors.length > 0 ? (
            authors.map((author) => (
              <div key={author.id} className="author-item text-center">
                <Link to={`/author/${author.id}`} className="text-decoration-none text-dark">
                  <img
                    src={`http://localhost:5000/${author.profileImagePath}`}
                    alt={author.name}
                    className="author-profile-img"
                  />
                  <h5 className="mt-2">{author.name}</h5>
                </Link>
              </div>
            ))
          ) : (
            <p>Yükleniyor...</p>
          )}
        </div>
    </div>
  );
};

export default AuthorsSection;
