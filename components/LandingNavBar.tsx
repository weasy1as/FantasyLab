"use client";

import React, { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
} from "@/components/ui/resizable-navbar"; // your file path

export default function LandingNavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "Teams", link: "/teams" },
    { name: "Fixtures", link: "/fixtures" },
    { name: "Compare", link: "/compare" },
  ];

  return (
    <Navbar className="sticky top-0 z-50 ">
      {/* Desktop / Main Navbar */}
      <NavBody>
        {/* Logo */}
        <NavbarLogo />

        {/* Nav Links */}
        <NavItems items={navLinks} />
      </NavBody>

      {/* Mobile Navbar */}
      <MobileNav visible={true}>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navLinks.map((item, idx) => (
            <a
              href={item.link}
              key={idx}
              className="w-full px-4 py-2 text-white rounded-md hover:bg-neutral-800/50"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
