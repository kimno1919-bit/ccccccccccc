import React, { useState, useEffect } from 'react';
import { X, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

const SecretMenu = ({ isOpen, onClose, secretQueue, setSecretQueue, students }) => {
  const [selectedStudent, setSelectedStudent] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (selectedStudent && !secretQueue.includes(selectedStudent)) {
      setSecretQueue([...secretQueue, selectedStudent]);
      setSelectedStudent('');
    }
  };

  const handleRemove = (index) => {
    const newQueue = [...secretQueue];
    newQueue.splice(index, 1);
    setSecretQueue(newQueue);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newQueue = [...secretQueue];
    [newQueue[index - 1], newQueue[index]] = [newQueue[index], newQueue[index - 1]];
    setSecretQueue(newQueue);
  };

  const moveDown = (index) => {
    if (index === secretQueue.length - 1) return;
    const newQueue = [...secretQueue];
    [newQueue[index + 1], newQueue[index]] = [newQueue[index], newQueue[index + 1]];
    setSecretQueue(newQueue);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🕵️‍♂️ [비밀 메뉴] 발표자 순서 조작</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-light)' }}>
          이곳에 추가된 순서대로 슬롯머신에서 100% 당첨됩니다.<br/>
          (추출 인원 수와 무관하게 이 큐에서 먼저 뽑힙니다.)
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <select 
            value={selectedStudent} 
            onChange={(e) => setSelectedStudent(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="">학생 선택...</option>
            {students.filter(s => !secretQueue.includes(s)).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={handleAdd} className="btn-primary">추가</button>
        </div>

        <div className="student-list" style={{ maxHeight: '250px' }}>
          {secretQueue.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-light)' }}>
              설정된 비밀 순서가 없습니다.<br/>정상적으로 랜덤 추출됩니다.
            </div>
          ) : (
            secretQueue.map((student, index) => (
              <div key={student} className="student-item">
                <span style={{ fontWeight: 'bold', width: '30px' }}>{index + 1}.</span>
                <span style={{ flex: 1 }}>{student}</span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button className="student-item-delete" style={{ color: 'var(--text-light)' }} onClick={() => moveUp(index)} disabled={index === 0}>
                    <ArrowUp size={16} />
                  </button>
                  <button className="student-item-delete" style={{ color: 'var(--text-light)' }} onClick={() => moveDown(index)} disabled={index === secretQueue.length - 1}>
                    <ArrowDown size={16} />
                  </button>
                  <button className="student-item-delete" onClick={() => handleRemove(index)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SecretMenu;
