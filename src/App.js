import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [stories, setStories] = useState([]);
  const [offset, setOffset] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [isListView, setIsListView] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const menuRef = useRef(null);

  useEffect(() => {
    fetch('/stories.json')
      .then(res => res.json())
      .then(data => {
        const initial = data.slice(0, 20);
        setStories(initial);
        setHasMore(data.length > 20);
      })
      .catch(err => console.error('Error loading stories:', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const loadMore = () => {
    fetch(`/archive/stories-${offset + 1}-${offset + 20}.json`)
      .then(res => res.json())
      .then(newStories => {
        setStories([...stories, ...newStories]);
        setOffset(offset + 20);
        setHasMore(newStories.length === 20);
      })
      .catch(() => setHasMore(false));
  };

  const toggleView = () => {
    setIsListView(!isListView);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="site-header">
        <div className="logo">
          <img
            src={isDarkMode ? '/images/logoblack.png' : '/images/logo.png'}
            alt="HB.NEWS Logo"
          />
        </div>
        <ul className="social-links">
          <li>
            <a href="https://twitter.com/_hbnews" target="_blank" rel="noopener noreferrer">
              <img
                src={isDarkMode ? '/images/x-icon-white.svg' : '/images/x-icon.svg'}
                alt="X (Twitter)"
                className="social-icon"
              />
            </a>
          </li>
          <li>
            <a href="https://instagram.com/surfcity.usa" target="_blank" rel="noopener noreferrer">
              <img
                src={isDarkMode ? '/images/instagram-icon-white.svg' : '/images/instagram-icon.svg'}
                alt="Instagram"
                className="social-icon"
              />
            </a>
          </li>
          <li className="tools-menu" ref={menuRef}>
            <button onClick={toggleMenu} className="tools-btn">
              <img
                src={isDarkMode ? '/images/tools-icon-white.svg' : '/images/tools-icon.svg'}
                alt="Tools"
                className="social-icon"
              />
            </button>
            {isMenuOpen && (
              <ul className="submenu">
                <li>
                  <button onClick={toggleView} className="submenu-item">
                    {isListView ? 'Default View' : 'List View'}
                  </button>
                </li>
                <li>
                  <button onClick={toggleDarkMode} className="submenu-item">
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>
                </li>
                <li>
                  <button onClick={closeMenu} className="submenu-close">✕</button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </header>
      <div className="main-content">
        <div id="stories">
          {stories.map(story => (
            <div key={story.id} className={`story ${isListView ? 'list-view' : ''}`}>
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                {story.headline}
              </a>
              {story.image && !isListView && (
                <img
                  src={story.image.replace('public/', '/')}
                  alt={story.headline}
                  loading="lazy"
                  onError={(e) => console.log(`Failed to load image: ${e.target.src}`)}
                />
              )}
            </div>
          ))}
        </div>
        {hasMore && <button onClick={loadMore}>Load More</button>}
      </div>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} HB.NEWS. All rights reserved.</p>
        <p><a href="#" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>Back to Top</a></p>
      </footer>
    </div>
  );
}

export default App;