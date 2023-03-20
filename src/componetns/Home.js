import AOS from "aos";
import "aos/dist/aos.css";
import { useState, useEffect } from "react";


const Home = () => {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
      }, []);
    return(
        <div className="Home">
        <h3 data-aos="fade-right" className="pedro">Home</h3>
        <img src="/images/logo.jpg" data-aos="fade-left" className="imag" alt="" />
        <h3 data-aos="fade-right" className="Some">Some text about this cup of tea</h3>
        <img src="/images/logo.jpg" data-aos="fade-left" className="imag" alt="" />
        <img src="/images/logo.jpg" data-aos="fade-left" className="imag" alt="" />
        <h3 data-aos="fade-right" className="Some">Some text about this cup of tea</h3>
     </div> 
        
    )
}

export default Home