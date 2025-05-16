import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterStep1 from './RegisterStep1';
import RegisterStep2 from './RegisterStep2';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    theme: 'light',
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
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        body: form,
      });

      const result = await res.json();

      if (!res.ok) {
        setServerErrors({ general: result.message });
        return;
      }

      sessionStorage.setItem('token', result.token);

      const userRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${result.token}` },
      });

      const userData = await userRes.json();

      if (!userRes.ok) {
        setServerErrors({ general: userData.message || 'No se pudo obtener el usuario' });
        return;
      }

      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setServerErrors({ general: 'Error en la petición al servidor' });
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
