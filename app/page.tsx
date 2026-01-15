
"use client";

import Captcha from "./component/captcha";

export default function Home() {
  
  return (
    <>
      <h1 className="flex text-4xl font-bold mt-5 justify-center">Captcha Generator</h1>
      <div className="flex justify-center mt-5">
        <Captcha/>
      </div>
    </>
  );
}
