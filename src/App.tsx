import { useState, useEffect } from 'react';
import type { Teacher } from './lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENTS ---
import Login from './components/Login';
import Attendance from './components/Attendance';
import TeacherHome from './components/TeacherHome';
import ActivityRegistry from './components/ActivityRegistry';

type TeacherView = 'menu' | 'attendance' | 'activities';

const App = () => {
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [teacherView, setTeacherView] = useState<TeacherView>('menu');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          style={{ width: 45, height: 45, border: '3px solid var(--border-glass)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}
        />
      </div>
    );
  }

  return (
    <div className="app-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <AnimatePresence mode='wait'>
        {!currentTeacher ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Login onLogin={(teacher) => { setCurrentTeacher(teacher); setTeacherView('menu'); }} />
          </motion.div>
        ) : (
          <motion.div
            key="attendance"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {teacherView === 'menu' && (
              <TeacherHome
                teacher={currentTeacher}
                onAttendance={() => setTeacherView('attendance')}
                onActivities={() => setTeacherView('activities')}
                onLogout={() => setCurrentTeacher(null)}
              />
            )}
            {teacherView === 'attendance' && <Attendance teacher={currentTeacher} onLogout={() => setTeacherView('menu')} />}
            {teacherView === 'activities' && <ActivityRegistry teacher={currentTeacher} onBack={() => setTeacherView('menu')} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
