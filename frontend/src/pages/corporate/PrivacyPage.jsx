import React from 'react';
import Layout from '../../components/layout/Layout';
import { CONTACT_EMAILS } from '../../config/constants';

const PrivacyPage = () => {
  return (
    <Layout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="fw-bold mb-4">Política de Privacidad</h1>
            <p className="text-muted mb-4">Última actualización: 26 de junio de 2025</p>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">1. Información que recopilamos</h2>
                <p>Recopilamos los siguientes tipos de información:</p>
                <ul>
                  <li><strong>Información de identidad:</strong> Nombre, apellido y nombre de usuario.</li>
                  <li><strong>Información de contacto:</strong> Dirección de correo electrónico.</li>
                  <li><strong>Información técnica:</strong> Dirección IP, datos de inicio de sesión, tipo de navegador y configuración.</li>
                  <li><strong>Información de uso:</strong> Cómo utilizas nuestro sitio web y servicios.</li>
                </ul>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">2. Cómo utilizamos tu información</h2>
                <p>Utilizamos tu información para:</p>
                <ul>
                  <li>Registrar y administrar tu cuenta</li>
                  <li>Proporcionar y mejorar nuestros servicios</li>
                  <li>Personalizar tu experiencia</li>
                  <li>Comunicarnos contigo</li>
                  <li>Analizar el uso del sitio para mejorar nuestros servicios</li>
                </ul>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">3. Cookies</h2>
                <p>Utilizamos cookies para distinguirte de otros usuarios y mejorar tu experiencia. Puedes configurar tu navegador para rechazar todas o algunas cookies, o para alertarte cuando los sitios web configuren o accedan a las cookies.</p>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">4. Tus derechos</h2>
                <p>Tienes derecho a:</p>
                <ul>
                  <li>Acceder a tus datos personales</li>
                  <li>Corregir datos inexactos</li>
                  <li>Solicitar la eliminación de tus datos</li>
                  <li>Oponerte al procesamiento de tus datos</li>
                  <li>Retirar el consentimiento</li>
                </ul>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">5. Contacto</h2>
                <p>Si tienes preguntas sobre esta política de privacidad, contáctanos en:</p>
                <p><a href={`mailto:${CONTACT_EMAILS.SUPPORT}`}>{CONTACT_EMAILS.SUPPORT}</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
