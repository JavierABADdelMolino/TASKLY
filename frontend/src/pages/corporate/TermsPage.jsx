import React from 'react';
import Layout from '../../components/layout/Layout';
import { CONTACT_EMAILS } from '../../config/constants';

const TermsPage = () => {
  return (
    <Layout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="fw-bold mb-4">Términos y Condiciones</h1>
            <p className="text-muted mb-4">Última actualización: 26 de junio de 2025</p>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">1. Aceptación de los Términos</h2>
                <p>Al usar Taskly, aceptas estos términos en su totalidad. Si no estás de acuerdo, no debes utilizar nuestro servicio.</p>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">2. Cuentas de Usuario</h2>
                <p>Al crear una cuenta, debes proporcionar información precisa y actualizada. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.</p>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">3. Uso del Servicio</h2>
                <p>No debes utilizar el Servicio para:</p>
                <ul>
                  <li>Violar leyes o regulaciones</li>
                  <li>Transmitir contenido que sea ilegal u ofensivo</li>
                  <li>Suplantar a cualquier persona o entidad</li>
                  <li>Interferir con el funcionamiento del Servicio</li>
                </ul>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">4. Propiedad Intelectual</h2>
                <p>El Servicio y su contenido original son propiedad exclusiva de Taskly y están protegidos por leyes de propiedad intelectual.</p>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">5. Terminación</h2>
                <p>Podemos terminar o suspender tu acceso al Servicio inmediatamente, sin previo aviso, por cualquier motivo, incluido si incumples estos Términos.</p>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">6. Contacto</h2>
                <p>Si tienes preguntas sobre estos Términos, contáctanos en:</p>
                <p><a href={`mailto:${CONTACT_EMAILS.SUPPORT}`}>{CONTACT_EMAILS.SUPPORT}</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
