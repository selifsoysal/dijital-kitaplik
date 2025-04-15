import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FiltersSidebar.css';

interface FiltersSidebarProps {
  authors: string[];
  tags: string[];
  categories: string[];
  selectedCategory: string | null;
  selectedTags: string[];
  selectedAuthor: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedAuthor: React.Dispatch<React.SetStateAction<string | null>>;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  authors,
  tags,
  categories,
  selectedCategory,
  selectedTags,
  selectedAuthor,
  setSelectedCategory,
  setSelectedTags,
  setSelectedAuthor,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');
    const tagsParam = queryParams.getAll('tag');
    const authorParam = queryParams.get('author');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (tagsParam.length > 0) {
      setSelectedTags(tagsParam);
    }
    if (authorParam) {
      setSelectedAuthor(authorParam);
    }
  }, [location.search, setSelectedCategory, setSelectedTags, setSelectedAuthor]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    navigate(`/books?category=${e.target.value}`);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const updatedTags = checked
      ? [...selectedTags, value]
      : selectedTags.filter((tag) => tag !== value);

    setSelectedTags(updatedTags);
    navigate(`/books?category=${selectedCategory || ''}&tag=${updatedTags.join('&tag=')}`);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAuthor(e.target.value);
    navigate(`/books?author=${e.target.value}`);
  };

  return (
    <div className="filters-sidebar">
      <h3>Filtrele</h3>
      <div>
        <h4>Yazar</h4>
        <select value={selectedAuthor || ''} onChange={handleAuthorChange}>
          <option value="">Yazar Seç</option>
          {authors.map((author, index) => (
            <option key={index} value={author}>
              {author}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h4>Kategori</h4>
        <select value={selectedCategory || ''} onChange={handleCategoryChange}>
          <option value="">Kategori Seç</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h4>Etiketler</h4>
        {tags.map((tag, index) => (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={handleTagChange}
              />
              {tag}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiltersSidebar;
