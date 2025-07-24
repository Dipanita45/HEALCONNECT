import Link from 'next/link';
import React from 'react'
import { FaGithubAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="container text-center my-6 p-8 text-gray5 dark:text-gray3">
      <div className="mx-auto w-24 h-1 my-4 bg-gradient-to-r from-gray5 to-gray4 rounded-full"></div>
      <div className="py-3">
        Need help? Email{" "}
        <a href="dipanitamondal@gmail.com">
          <strong className=" font-bold">dipanitamondal@gmail</strong>
        </a>
      </div>
      <div className="flex justify-center items-center my-2">
        <a href="https://github.com/Dipanita45/HEALCONNECT">
          <i className="w-6 inline-block mx-2">
            <FaGithubAlt size={24} />
          </i>
        </a>
      </div>
      <h6>Helpful Links</h6>
      <div className="py-3">
        <Link href="/about"><span>About</span> |</Link>
        <Link href="#"><span> Contrib</span> |</Link>
        <Link href="#"><span> Privacy</span> |</Link>
        <Link href="#"><span> Terms</span></Link>
      </div>
      <div className="text-xs">
        Copyright © 2025 HealConnect LLC <br />
      </div>
    </footer>
  );
}