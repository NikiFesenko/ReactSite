import AOS from "aos";
import "aos/dist/aos.css";
import { useState, useEffect } from "react";

const Pricing = () => {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
      }, []);
    return(
        <div>
        <h3 data-aos="fade-right" className="pedro">Pricing</h3>
         <img src="/images/lenovo.jpg" h data-aos="fade-left" className="lenovo" alt=""еу></img> 
        <h3 className="price">Pricing </h3>
        <h3 className="rect"  >
            <a href="/pricing/pixel" data-aos="fade-right" className="Pixel">Price</a>
        </h3>
    </div>
    )
}

export default Pricing 