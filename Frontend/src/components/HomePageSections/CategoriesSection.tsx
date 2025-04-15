import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './CategoriesSection.css';

interface Category {
  id: number;
  name: string;
}

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/categories?limit=8&sort=desc')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 200;
    }
  };

  return (
    <div className="container my-5 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Kategoriler</h2>
        <Link to="/categories" className="btn btn-link text-decoration-none" style={{color: "rgb(118,187,175"}}>
          Tümünü Gör →
        </Link>
      </div>

      <div className="categories-scroll-wrapper">
        <div className="categories-scroll-container" ref={scrollContainerRef}>
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="category-item">
                <Link
                  to={`/books?category=${encodeURIComponent(category.name)}`}
                  className="text-decoration-none text-dark"
                >
                  <h5 className="mt-2">{category.name}</h5>
                </Link>
              </div>
            ))
          ) : (
            <p>Yükleniyor...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;
