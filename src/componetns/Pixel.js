import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useState, useEffect } from "react";


const Pixel = () => {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
      }, []);
return(
    <div>
        <h3 data-aos="fade-right" className="Pux">Lenovo lp 40</h3>
        <img src="/images/lp.jpg" data-aos="fade-left" className="imag" alt="" />
        <h3 className="tuxt">Lenovo lp40 Price:30$</h3>
        <h1 className="pop">Popular today</h1>
        <img src="/images/mouse.jpg" data-aos="fade-left" className="ms" alt="" />
    </div>
)
}

export default Pixel