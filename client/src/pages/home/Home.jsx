import React,{useEffect} from 'react'
import HeroSection from '../home/heroSection/HeroSection';
import UpComingEvents from '../Events/upComingEvents/UpComingEvents';
import PastEvents from '../Events/pastEvents/PastEvents';
import NewsLetter from '../../components/NewsLetter';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <HeroSection />
      <div className='p-3'>
        <UpComingEvents />
        <PastEvents />
        <NewsLetter/>
      </div>
    </>
  );
}

export default Home