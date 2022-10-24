import React, { useEffect, useState } from "react";
import Constants from "_constants/index";
import zkDID from '../zkDID';
import ethers from 'ethers';
import { CONSTRAINTS_CREDITS, CONSTRAINT_CREDIT_650, CONSTRAINT_GPA_35 } from "_src/zkDID/constraints";
import { CreditScoreCredential, GPACredential } from "_src/zkDID/credential";
import { getCircuit, hasCircuit, ZKCircuit } from "_src/zkDID/circuit";
import Step1 from "_components/step1";
import Step2 from "_components/step2";
import Step3 from "_components/step3";

const HomeIndex: React.FC = () => {
  const [steps, _steps] = useState([false, false, false]);

  useEffect(() => {
    let step = 0;
    const timers: any[] = [];
    const showStep = (count: number) => {
      const timer = setTimeout(() => {
        _steps((v) => {
          v[count] = true;
          return [...v];
        });
      }, 1000 * count);
      timers.push(timer);
    }
    while(step < steps.length) {
      showStep(step);
      step++;
    }
    return () => {
      timers.forEach(v => clearTimeout(v));
    }
  }, []);
  return (
    <div>
      {<Step1 />}
      {<Step2 />}
      {<Step3 />}
    </div>
  );
}

export default HomeIndex;
