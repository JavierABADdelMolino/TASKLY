import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterStep1 from './RegisterStep1';
import RegisterStep2 from './RegisterStep2';
import GoogleLoginButton from './GoogleLoginButton';
import GoogleRegisterComplete from './GoogleRegisterComplete';
import { useAuth } from '../../context/AuthContext';
import { register, getCurrentUser } from '../../services/authService';
import Separator from '../common/Separator';

const RegisterForm = ({ googleData: googleDataProp }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Iniciar directamente en el paso Google si hay datos de Google
  const [step, setStep] = useState(googleDataProp ? 'google-complete' : 1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
  });

  // Estado para el registro con Google - inicializar con los datos recibidos como prop si existen
  const [googleData, setGoogleData] = useState(googleDataProp || null);
  const [serverErrors, setServerErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Efecto para reaccionar a cambios en googleDataProp
  useEffect(() => {
    if (googleDataProp) {
      setGoogleData(googleDataProp);
      setStep('google-complete');
    }
  }, [googleDataProp]);

  // Intentar recuperar datos de Google del sessionStorage si no vienen como props
  useEffect(() => {
    if (!googleDataProp) {
      try {
        const storedData = sessionStorage.getItem('googleAuthData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.needsCompletion || parsedData.code === 'NEEDS_COMPLETION') {
            setGoogleData(parsedData);
            setStep('google-complete');
            // Limpiamos después de usarlo
            sessionStorage.removeItem('googleAuthData');
          }
        }
      } catch (error) {
        console.error("Error parsing Google data from sessionStorage:", error);
      }
    }
  }, [googleDataProp]);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setServerErrors((prev) => ({ ...prev, [field]: null, general: null }));
  };

  const onRegister = async () => {
    setLoading(true);
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
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
      setLoading(false);
    }
  };

  // Manejador para los datos de Google
  const handleGoogleSignIn = (data) => {
    // Si es un caso de vinculación de cuenta (email ya existe)
    if (data.needsLinking || data.code === 'LINK_GOOGLE') {
      console.log('Usuario necesita enlazar cuenta de Google desde RegisterForm');
      // Guardar datos en sessionStorage y luego enviar evento para abrir modal
      sessionStorage.setItem('googleAuthData', JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('openLinkGoogleModal', { detail: data }));
      return;
    }
    
    // Si es completar registro con Google (nuevo usuario)
    setGoogleData(data);
    setStep('google-complete');
  };
  
  // Cancelar el registro con Google
  const handleCancelGoogle = () => {
    setGoogleData(null);
    setStep(1);
    // Limpiamos también el sessionStorage
    sessionStorage.removeItem('googleAuthData');
  };

  return (
    <div className="auth-form-wrapper">
      {step === 1 && (
        <>
          <RegisterStep1
            data={formData}
            onChange={handleChange}
            onNext={nextStep}
            errors={serverErrors}
            loading={loading}
          />
          
          <div className="mt-4 mb-2">
            <Separator text="O" />
            <GoogleLoginButton onGoogleSignIn={handleGoogleSignIn} />
          </div>
        </>
      )}
      {step === 2 && (
        <RegisterStep2
          data={formData}
          onChange={handleChange}
          onBack={prevStep}
          onSubmit={onRegister}
          errors={serverErrors}
          loading={loading}
        />
      )}
      {step === 'google-complete' && googleData && (
        <GoogleRegisterComplete 
          googleData={googleData}
          onCancel={handleCancelGoogle}
        />
      )}
    </div>
  );
};

export default RegisterForm;
