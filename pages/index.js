import { useState } from 'react';
import { createPromiseClient } from '@bufbuild/connect';
import { CalculatorService } from '../gen/calculator_connect';

const client = createPromiseClient(CalculatorService, { baseUrl: 'http://localhost:8080' });

export default function Home() {
  const [firstNumber, setFirstNumber] = useState('');
  const [secondNumber, setSecondNumber] = useState('');
  const [operation, setOperation] = useState('+');
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    try {
      const response = await client.calculate({
        firstNumber: parseFloat(firstNumber),
        secondNumber: parseFloat(secondNumber),
        operation,
      });
      setResult(response.result);
    } catch (error) {
      console.error(error);
      setResult('Error: ' + error.message);
    }
  };

  const handleButtonClick = (button) => {
    if (button === '=') {
      handleCalculate();
    } else if (['+', '-', '*', '/'].includes(button)) {
      setOperation(button);
    } else {
      if (operation === '') {
        setFirstNumber(firstNumber + button);
      } else {
        setSecondNumber(secondNumber + button);
      }
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h1>Calculator</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          value={firstNumber + operation + secondNumber}
          readOnly
          style={{ padding: '10px', fontSize: '1.2em', textAlign: 'right' }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[7, 8, 9, '+', 4, 5, 6, '-', 1, 2, 3, '*', 0, '.', '=', '/' ].map((button) => (
            <button
              key={button}
              onClick={() => handleButtonClick(button)}
              style={{ padding: '10px', fontSize: '1.2em' }}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
      {result !== null && (
        <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '10px' }}>
          Result: {result}
        </div>
      )}
    </div>
  );
}
