import React from 'react'
import { footer } from "../../assets";

export const Footer = () => {
  return (
    <footer className="mt-[140px]">
      <img className="w-[110px] m-auto opacity-90" src={footer} alt="weightTrackingLogo" />
      <p className='text-stone-600 text-sm text-center'>&copy;2023</p>
    </footer>
  );
}
export default Footer;