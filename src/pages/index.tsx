import { waitDIDKitMounted } from "@findora/zkdid-js/dist/did";
import React, { useEffect, useState } from "react";
import Step1 from "_components/step1";
import Step2 from "_components/step2";
import Step3 from "_components/step3";
import '@spruceid/didkit-wasm';

const HomeIndex: React.FC = () => {
  const [mounted, _mounted] = useState(false);
  useEffect(() => {
    waitDIDKitMounted().then(() => {
      _mounted(true);
    })
  }, []);

  if (!mounted) return null;
  return (
    <div>
      <Step1 />
      <Step2 />
      <Step3 />
    </div>
  );
}

export default HomeIndex;
