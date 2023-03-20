import AOS from "aos";
import "aos/dist/aos.css";
import { useState, useEffect } from "react";


const About = () => {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
      }, []);
    return(
        <div className="About">
            <h3 data-aos="fade-right" className="pedro">About</h3>

        </div>
    )
}

export default About