import React from 'react';
import "./main.css"
import About from './componetns/About';
import Navbar from './componetns/Navbar';
import Pricing from './componetns/Pricing';
import Home from './componetns/Home';
import AOS from "aos";
import "aos/dist/aos.css";
import { useState, useEffect } from "react";
import Pixel from './componetns/Pixel';



const App = () => {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
  let component
  switch(window.location.pathname){
  case "/":
    component = <Home />
    break
    case "/about":
      component = <About />
      break
      case "/pricing":
        component = <Pricing />
        break
        case "/pricing/pixel":
          component = <Pixel />
          break
    }
  return(
    <>
      <Navbar />
      {component}
    </>
  )
}

export default App;






