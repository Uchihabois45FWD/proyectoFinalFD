// Importaciones principales de React
import React, { useState } from "react";
// Componentes de iconos de Lucide
import { Eye, EyeOff } from "lucide-react";
// Estilos específicos del formulario de registro
import "../styles/pages/RegisterForm.css";

function RegisterForm({
  // Valores por defecto para los datos del formulario
  registerData = { 
    name: "", 
    lastName: "", 
    secondLastName: "", 
    phone: "", 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  },
  showPassword = false,
  showConfirmPassword = false,
  loading = false,
  message = null,
  onChange = () => {},
  onSubmit = (e) => { e.preventDefault(); },
  onTogglePassword = () => {},
  onToggleConfirmPassword = () => {},
}) {
  // Estado para rastrear qué campos han sido tocados (para mostrar errores solo después de interactuar)
  const [touched, setTouched] = useState({ 
    name: false, 
    lastName: false, 
    secondLastName: false, 
    phone: false, 
    username: false, 
    email: false, 
    password: false, 
    confirmPassword: false 
  });

  // Objeto que contiene los mensajes de error de validación para cada campo
  const errors = {
    name: registerData?.name ? "" : "Ingresa tu nombre",
    lastName: registerData?.lastName ? "" : "Ingresa tu apellido",
    secondLastName: registerData?.secondLastName ? "" : "Ingresa tu segundo apellido",
    phone: registerData?.phone ? "" : "Ingresa tu teléfono",
    username: registerData?.username ? "" : "Ingresa tu nombre de usuario",
    email: registerData?.email ? "" : "Ingresa tu correo",
    // Validación de contraseña: requerida y longitud mínima de 6 caracteres
    password: !registerData?.password
      ? "Ingresa una contraseña"
      : registerData?.password.length < 6
      ? "Debe tener al menos 6 caracteres"
      : "",
    // Validación de confirmación de contraseña: debe coincidir con la contraseña
    confirmPassword:
      registerData?.confirmPassword
        ? registerData?.password !== registerData?.confirmPassword
          ? "Las contraseñas no coinciden"
          : ""
        : "Confirma tu contraseña",
  };

  /**
   * Maneja el evento blur de los campos del formulario
   * Marca el campo como "tocado" para mostrar los mensajes de error
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  /**
   * Maneja el envío del formulario
   * Previene el comportamiento por defecto y llama a la función onSubmit proporcionada
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  // Renderizado del formulario de registro
  return (
    <form 
      className="register-form" 
      onSubmit={handleSubmit}
      aria-label="Formulario de registro"
    >
      {/* Título y subtítulo del formulario */}
      <h1 className="register-title">Crear cuenta</h1>
      <p className="register-subtitle">Completa los campos para registrarte.</p>
      
      {/* Mensaje de estado/error del formulario */}
      {message?.text && (
        <div 
          className={`register-message ${message.type || 'info'}`} 
          role={message.type === 'error' ? 'alert' : 'status'}
          aria-live={message.type === 'error' ? 'assertive' : 'polite'}
        >
          {message.text}
        </div>
      )}

      {/* Campo de nombre */}
      <div className="field">
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Nombre"
          value={registerData?.name || ""}
          onChange={onChange}
          onBlur={handleBlur}
          disabled={loading}
          required
          className="form-input"
          aria-required="true"
          aria-invalid={touched.name && !!errors.name}
          aria-describedby={touched.name && errors.name ? "name-error" : undefined}
        />
      </div>
      {touched.name && errors.name && (
        <div id="name-error" className="error-message" role="alert">
          {errors.name}
        </div>
      )}

      {/* Campos de apellidos en dos columnas */}
      <div className="grid-two">
        {/* Campo de primer apellido */}
        <div className="field">
          <label htmlFor="lastName">Apellido</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={registerData?.lastName || ""}
            onChange={onChange}
            onBlur={handleBlur}
            disabled={loading}
            className="form-input"
            aria-invalid={touched.lastName && !!errors.lastName}
            aria-describedby={touched.lastName && errors.lastName ? "lastName-error" : undefined}
          />
          {touched.lastName && errors.lastName && (
            <div id="lastName-error" className="error-message" role="alert">
              {errors.lastName}
            </div>
          )}
        </div>
        
        {/* Campo de segundo apellido */}
        <div className="field">
          <label htmlFor="secondLastName">Segundo apellido</label>
          <input
            id="secondLastName"
            type="text"
            name="secondLastName"
            placeholder="Segundo apellido"
            value={registerData?.secondLastName || ""}
            onChange={onChange}
            onBlur={handleBlur}
            disabled={loading}
            className="form-input"
            aria-invalid={touched.secondLastName && !!errors.secondLastName}
            aria-describedby={touched.secondLastName && errors.secondLastName ? "secondLastName-error" : undefined}
          />
          {touched.secondLastName && errors.secondLastName && (
            <div id="secondLastName-error" className="error-message" role="alert">
              {errors.secondLastName}
            </div>
          )}
        </div>
      </div>

      {/* Campos de teléfono y nombre de usuario en dos columnas */}
      <div className="grid-two">
        {/* Campo de teléfono */}
        <div className="field">
          <label htmlFor="phone">Teléfono</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="Teléfono"
            value={registerData?.phone || ""}
            onChange={onChange}
            onBlur={handleBlur}
            disabled={loading}
            className="form-input"
            aria-invalid={touched.phone && !!errors.phone}
            aria-describedby={touched.phone && errors.phone ? "phone-error" : undefined}
          />
          {touched.phone && errors.phone && (
            <div id="phone-error" className="error-message" role="alert">
              {errors.phone}
            </div>
          )}
        </div>
        
        {/* Campo de nombre de usuario */}
        <div className="field">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={registerData?.username || ""}
            onChange={onChange}
            onBlur={handleBlur}
            disabled={loading}
            className="form-input"
            aria-invalid={touched.username && !!errors.username}
            aria-describedby={touched.username && errors.username ? "username-error" : undefined}
          />
          {touched.username && errors.username && (
            <div id="username-error" className="error-message" role="alert">
              {errors.username}
            </div>
          )}
        </div>
      </div>

      {/* Campo de correo electrónico */}
      <div className="field">
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={registerData?.email || ""}
          onChange={onChange}
          onBlur={handleBlur}
          disabled={loading}
          required
          className="form-input"
          aria-required="true"
          aria-invalid={touched.email && !!errors.email}
          aria-describedby={touched.email && errors.email ? "email-error" : undefined}
        />
        {touched.email && errors.email && (
          <div id="email-error" className="error-message" role="alert">
            {errors.email}
          </div>
        )}
      </div>

      {/* Campo de contraseña con botón para mostrar/ocultar */}
      <div className="field password-field">
        <label htmlFor="password">Contraseña</label>
        <div className="input-with-icon">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            value={registerData?.password || ""}
            onChange={onChange}
            onBlur={handleBlur}
            disabled={loading}
            required
            className="form-input"
            aria-required="true"
            aria-invalid={touched.password && !!errors.password}
            aria-describedby={touched.password && errors.password ? "password-error" : undefined}
          />
          {/* Botón para alternar la visibilidad de la contraseña */}
          <button
            type="button"
            className="input-eye"
            onClick={onTogglePassword}
            disabled={loading}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-controls="password"
            aria-expanded={showPassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {touched.password && errors.password && (
          <div id="password-error" className="error-message" role="alert">
            {errors.password}
          </div>
        )}
      </div>

      {/* Campo de confirmación de contraseña con botón para mostrar/ocultar */}
      <div className="field password-field">
        <label htmlFor="confirmPassword">Confirmar contraseña</label>
        <div className="input-with-icon">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={registerData?.confirmPassword || ""}
            onChange={onChange}
            onBlur={handleBlur}
            disabled={loading}
            required
            className="form-input"
            aria-required="true"
            aria-invalid={touched.confirmPassword && !!errors.confirmPassword}
            aria-describedby={touched.confirmPassword && errors.confirmPassword ? "confirmPassword-error" : undefined}
          />
          {/* Botón para alternar la visibilidad de la confirmación de contraseña */}
          <button
            type="button"
            className="input-eye"
            onClick={onToggleConfirmPassword}
            disabled={loading}
            aria-label={showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
            title={showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
            aria-controls="confirmPassword"
            aria-expanded={showConfirmPassword}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {touched.confirmPassword && errors.confirmPassword && (
          <div id="confirmPassword-error" className="error-message" role="alert">
            {errors.confirmPassword}
          </div>
        )}
      </div>

      {/* Botón de envío del formulario */}
      <button 
        type="submit" 
        className={`btn primary submit-btn ${loading ? 'loading' : ''}`} 
        disabled={loading}
        aria-busy={loading}
        aria-live="polite"
      >
        {loading ? (
          <>
            <span className="spinner" aria-hidden="true"></span>
            <span>Creando cuenta...</span>
          </>
        ) : "Crear cuenta"}
      </button>
    </form>
  );
}
export default RegisterForm;
