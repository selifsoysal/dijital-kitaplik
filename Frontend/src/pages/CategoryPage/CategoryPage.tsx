import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './CategoryPage.css'; // CSS dosyasını import ediyoruz

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const categoryResponse = await fetch('http://localhost:5000/api/categories');
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

        const tagResponse = await fetch('http://localhost:5000/api/tags');
        const tagData = await tagResponse.json();
        setTags(tagData);
      } catch (error) {
        console.error("Error fetching categories and tags:", error);
      }
    };

    fetchCategoriesAndTags();
  }, []);

  return (
    <div className="category-page my-5">
      <h1>Kategoriler</h1>
      <div className="category-list">
        {categories.length === 0 ? (
          <p>No categories available.</p>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="category-card">
              <Link to={`/books?category=${category.name}`} className="category-link">
                <button className="category-button">
                  {category.name}
                </button>
              </Link>

              <div className="tag-list">
                <h4>Tags:</h4>
                {tags.length === 0 ? (
                  <p>No tags available.</p>
                ) : (
                  tags.map((tag) => (
                    <Link
                      key={tag.id}
                      to={`/books?category=${category.name}&tag=${tag.name}`}
                      className="tag-link"
                    >
                      <button className="tag-button">{tag.name}</button>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
