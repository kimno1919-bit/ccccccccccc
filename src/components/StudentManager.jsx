import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const StudentManager = ({ students, setStudents }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 구분자(엔터, 쉼표, 띄어쓰기 등)로 여러 명 분리 가능하도록 정규식 처리
    const newStudents = inputValue
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '' && !students.includes(s));

    if (newStudents.length > 0) {
      setStudents([...students, ...newStudents]);
    }
    setInputValue('');
  };

  const handleRemove = (studentToRemove) => {
    setStudents(students.filter((s) => s !== studentToRemove));
  };

  const handleClear = () => {
    if (confirm('학생 명단을 모두 지우시겠습니까?')) {
      setStudents([]);
    }
  };

  return (
    <div className="glass-panel sidebar">
      <h3>👨‍🎓 학생 명단 ({students.length}명)</h3>
      
      <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <textarea
          placeholder="이름 입력 (쉼표나 줄바꿈으로 여러명 추가 가능)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          rows={3}
          style={{ resize: 'vertical' }}
        />
        <button type="submit" className="btn-secondary">
          <Plus size={18} /> 추가하기
        </button>
      </form>

      <div className="student-list">
        {students.length === 0 ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-light)' }}>
            학생을 추가해주세요.
          </div>
        ) : (
          students.map((student, index) => (
            <div key={index} className="student-item">
              <span>{student}</span>
              <button 
                className="student-item-delete"
                onClick={() => handleRemove(student)}
                title="삭제"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {students.length > 0 && (
        <button onClick={handleClear} className="btn-danger" style={{ marginTop: 'auto' }}>
          명단 초기화
        </button>
      )}
    </div>
  );
};

export default StudentManager;
