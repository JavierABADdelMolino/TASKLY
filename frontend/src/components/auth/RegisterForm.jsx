import { useState } from 'react';
import RegisterStep1 from './RegisterStep1';
import RegisterStep2 from './RegisterStep2';

const RegisterForm = ({ onRegister }) => {
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

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="auth-form-wrapper">
      {step === 1 && (
        <RegisterStep1
          data={formData}
          onChange={handleChange}
          onNext={nextStep}
        />
      )}
      {step === 2 && (
        <RegisterStep2
          data={formData}
          onChange={handleChange}
          onBack={prevStep}
          onSubmit={onRegister}
        />
      )}
    </div>
  );
};

export default RegisterForm;
