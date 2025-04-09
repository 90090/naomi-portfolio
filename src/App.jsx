import { useState,useEffect,useRef } from "react";
import { useSanityData } from "./hooks/useSanityData.js"; // Custom hook to fetch data
import { FaInstagram, FaTiktok, FaYoutube,FaCross } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function PortfolioGallery({ portfolio, defaultPortfolio, setFullscreenImage }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const images = portfolio.images || defaultPortfolio.images;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto whitespace-nowrap py-6 cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div className="m-10 mr-10 flex space-x-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.asset?.url || image}
            alt="Portfolio"
            className="h-64 cursor-pointer hover:scale-105 transition"
            onClick={() => setFullscreenImage({ image, index, images })}
          />
        ))}
      </div>
    </div>
  );
}

function FullscreenImage({ fullscreenImage, setFullscreenImage }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const currentIndex = fullscreenImage?.index || 0;
  const images = fullscreenImage?.images || [];

  const goTo = (index) => {
    if (index >= 0 && index < images.length) {
      setFullscreenImage({ image: images[index], index, images });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
    if (e.key === 'Escape') setFullscreenImage(null);
  };

  useEffect(() => {
    if (fullscreenImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!fullscreenImage) return null;

  const currentImage = fullscreenImage.image;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={() => setFullscreenImage(null)}
    >
      <div
        className={`relative transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.asset?.url || currentImage}
          alt="Full"
          className="max-h-screen max-w-screen rounded-lg shadow-lg"
        />

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-white text-3xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition"
          onClick={() => setFullscreenImage(null)}
        >
          ×
        </button>

        {/* Left Arrow */}
        {currentIndex > 0 && (
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white"
            onClick={() => goTo(currentIndex - 1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        )}

        {/* Right Arrow */}
        {currentIndex < images.length - 1 && (
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white"
            onClick={() => goTo(currentIndex + 1)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ModelingPortfolio() {
  const { portfolio, brands, socials, email } = useSanityData();
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Fallback data in case the content is missing
  const defaultPortfolio = {
    headshot: "/images/headshot.png", // A placeholder image for headshot
    description: "Welcome to my modeling portfolio. I showcase my work, projects, and photo shoots here.",
    images: ["/default-image.jpg"], // A placeholder image for the portfolio gallery
  };

  const defaultSocials = {
    instagram: "https://www.instagram.com/naomiokolo",
    twitter: "https://twitter.com/naomiokolo",
    linkedin: "https://www.linkedin.com/in/naomiokolo",
  };

  const defaultEmail = "naomi.okolo@email.com";

  return (
    <div className="font-sans bg-white text-black">
      {/* Header */}
      <header className="relative w-full h-screen">
            <div 
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${portfolio.headshot?.asset?.url || defaultPortfolio.headshot})`,
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white bg-opacity-50">
          <h1 className="text-5xl font-bold">Naomi Okolo</h1>
        </div>
      </header>

      {/* Portfolio Section */}
      <section className="text-center px-6 mt-20">
        <h2 className="text-3xl font-semibold">My Photos</h2>
        <p className="mt-4 max-w-2xl mx-auto">{portfolio.description || defaultPortfolio.description}</p>
      </section>

      {/* Image Gallery */}
      <PortfolioGallery
      portfolio={portfolio}
      defaultPortfolio={defaultPortfolio}
      setFullscreenImage={setFullscreenImage}
      />

      {/* Fullscreen Image View */}
      {fullscreenImage && (
        <FullscreenImage
          fullscreenImage={fullscreenImage}
          setFullscreenImage={setFullscreenImage}
        />
      )}


      {/* Brands Section */}
      <section className="text-center py-10">
        <h2 className="text-3xl font-semibold">Brands I've Worked With</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center">
          {brands.map((brand, i) => (
            <img
              key={i}
              src={brand.logo.asset?.url || brand.logo.asset.url}
              alt="Brand Logo"
              className={`mx-auto mt-10 hover:scale-105 transition duration-300 ${
                brand.height || (i === 2 || i === 3 ? 'h-23' : 'h-23')
              }`}
            />
          ))}
        </div>
      </section>


      {/* Contact Section */}
      <section className="text-center py-10">
        <h2 className="text-3xl font-semibold">Let's Talk!</h2>
        <a
          href={`mailto:${email || defaultEmail}`}
          className="bg-pink-300 text-black px-6 py-3 mt-4 inline-block rounded-lg hover:bg-pink-200 transition"
        >
          Contact Me :)
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center py-6">
        <h2 className="text-xl font-semibold">My Socials</h2>
        <div className="flex justify-center space-x-4 mt-4">
          {socials?.instagram ? (
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-300  hover:text-pink-200 transition">
              <FaInstagram size={30} />
            </a>
          ) : (
            <a href={defaultSocials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-200 transition">
              <FaInstagram size={30} />
            </a>
          )}
          {socials?.tiktok ? (
            <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-pink-200 transition">
              <FaTiktok size={30} />
            </a>
          ) : (
            <a href={defaultSocials.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
              <FaTiktok size={30} />
            </a>
          )}
          {socials?.youtube ? (
            <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="text-pink-300  hover:text-pink-200 transition">
              <FaYoutube size={30} />
            </a>
          ) : (
            <a href={defaultSocials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
              <FaYoutube size={30} />
            </a>
          )}
          {socials?.randomlink ? (
            <a href={socials.randomlink} target="_blank" rel="noopener noreferrer" className="hover:text-pink-200 transition">
              <FaCross size={30} />
            </a>
          ) : (
            <a href={defaultSocials.randomlink} target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
              <FaCross size={30} />
            </a>
          )}
        </div>  
      </footer>
    </div>
  );
}
