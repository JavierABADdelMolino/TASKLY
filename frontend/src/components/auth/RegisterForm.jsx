import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterStep1 from './RegisterStep1';
import RegisterStep2 from './RegisterStep2';
import { useAuth } from '../../context/AuthContext';
import { register, getCurrentUser } from '../../services/authService';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    avatarFile: null,
  });

  const [serverErrors, setServerErrors] = useState({});

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setServerErrors((prev) => ({ ...prev, [field]: null, general: null }));
  };

  const onRegister = async () => {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'avatarFile' && value) {
        form.append('avatar', value);
      } else if (key !== 'avatarFile') {
        form.append(key, value);
      }
    });

    try {
      const result = await register(form);
      sessionStorage.setItem('token', result.token);

      const userData = await getCurrentUser();

      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.validation) {
        // Si errores de validación en paso 1, volver a página 1
        const v = err.validation;
        if (v.email || v.username || v.password || v.confirmPassword) {
          setStep(1);
        }
        setServerErrors(err.validation);
      }
      else if (err.message === 'El usuario ya existe' || err.message.includes('existe')) {
        // Email duplicado: mostrar error en email y volver a paso 1
        setServerErrors(prev => ({ ...prev, email: 'Este email ya está en uso' }));
        setStep(1);
      } else {
        setServerErrors(prev => ({ ...prev, general: err.message || 'Error en la petición al servidor' }));
      }
    }
  };

  return (
    <div className="auth-form-wrapper">
      {step === 1 && (
        <RegisterStep1
          data={formData}
          onChange={handleChange}
          onNext={nextStep}
          errors={serverErrors}
        />
      )}
      {step === 2 && (
        <RegisterStep2
          data={formData}
          onChange={handleChange}
          onBack={prevStep}
          onSubmit={onRegister}
          errors={serverErrors}
        />
      )}
    </div>
  );
};

export default RegisterForm;
