import React from 'react'
import { footer, logo } from "../../assets";

export const Footer = () => {
  return (
    <footer className="mt-[120px]">
      <img className="w-[210px] m-auto opacity-90" src={logo} alt="weightTrackingLogo" />
      <p className='text-stone-600 text-sm -mt-16 text-center'>&copy;2023</p>
    </footer>
  );
}
export default Footer;