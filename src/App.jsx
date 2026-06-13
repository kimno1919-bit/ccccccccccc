import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Play } from 'lucide-react';
import StudentManager from './components/StudentManager';
import SlotMachine from './components/SlotMachine';
import SecretMenu from './components/SecretMenu';

function App() {
  const [students, setStudents] = useState([]);
  const [secretQueue, setSecretQueue] = useState([]);
  const [winnerCount, setWinnerCount] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [results, setResults] = useState([]);
  const [isSecretMenuOpen, setIsSecretMenuOpen] = useState(false);

  // Ctrl + Shift + P 감지
  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      setIsSecretMenuOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDraw = () => {
    if (students.length === 0) {
      alert('학생 명단을 먼저 추가해주세요.');
      return;
    }
    if (winnerCount > students.length) {
      alert('추출 인원이 학생 수보다 많습니다.');
      return;
    }

    setIsDrawing(true);
    setResults([]);

    // 당첨자 결정 로직
    let currentSecretQueue = [...secretQueue];
    let newResults = [];
    let availableStudents = [...students];

    for (let i = 0; i < winnerCount; i++) {
      if (currentSecretQueue.length > 0) {
        // 비밀 큐에서 우선 추출
        const predefinedWinner = currentSecretQueue.shift();
        newResults.push(predefinedWinner);
        // availableStudents에서 제거하여 중복 방지
        availableStudents = availableStudents.filter(s => s !== predefinedWinner);
      } else {
        // 랜덤 추출
        const randomIndex = Math.floor(Math.random() * availableStudents.length);
        newResults.push(availableStudents[randomIndex]);
        availableStudents.splice(randomIndex, 1);
      }
    }

    // 약간의 딜레이 후 결과를 저장하고 멈춤 (자연스러운 멈춤을 위해 슬롯마다 시간을 다르게 줄 수도 있음)
    setTimeout(() => {
      setResults(newResults);
      setSecretQueue(currentSecretQueue);
      setIsDrawing(false);
    }, 2000); // 2초간 롤링
  };

  const handleAnimationComplete = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b']
    });
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>🎲 랜덤 발표자 뽑기</h1>
        <p>수업시간을 더 즐겁게! 발표자를 뽑아보세요.</p>
      </div>

      <div className="main-content glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <label style={{ fontWeight: '600' }}>추출 인원:</label>
          <select 
            value={winnerCount} 
            onChange={(e) => setWinnerCount(Number(e.target.value))}
            style={{ width: '100px' }}
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}명</option>
            ))}
          </select>
          
          <button 
            className="btn-primary" 
            onClick={handleDraw} 
            disabled={isDrawing || students.length === 0}
            style={{ padding: '0.75rem 2rem', fontSize: '1.25rem' }}
          >
            <Play fill="currentColor" size={20} />
            {isDrawing ? '뽑는 중...' : '발표자 뽑기!'}
          </button>
        </div>

        <div className="slots-grid">
          {Array.from({ length: winnerCount }).map((_, index) => (
            <SlotMachine 
              key={index} 
              isDrawing={isDrawing} 
              result={results[index] || null} 
              items={students}
              onComplete={index === winnerCount - 1 ? handleAnimationComplete : undefined} // 마지막 슬롯이 끝날 때 폭죽
            />
          ))}
        </div>

      </div>

      <StudentManager students={students} setStudents={setStudents} />

      <SecretMenu 
        isOpen={isSecretMenuOpen} 
        onClose={() => setIsSecretMenuOpen(false)} 
        secretQueue={secretQueue}
        setSecretQueue={setSecretQueue}
        students={students}
      />
    </div>
  );
}

export default App;
