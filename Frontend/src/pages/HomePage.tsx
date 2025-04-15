import React from 'react';
import HeroSection from '../components/HomePageSections/HeroSection';
import BookSection from '../components/HomePageSections/BookSection';
import AuthorsSection from '../components/HomePageSections/AuthorsSection';
import CategoriesSection from '../components/HomePageSections/CategoriesSection';

const HomePage: React.FC = () => {
  return (
    <div className='homepage' style={{marginTop: "70px"}} >
      <HeroSection />
      <BookSection />
      <AuthorsSection />
      <CategoriesSection />
    </div>
  );
};

export default HomePage;
