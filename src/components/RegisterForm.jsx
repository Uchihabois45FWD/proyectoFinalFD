import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "../styles/pages/RegisterForm.css";

function RegisterForm({
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

  const errors = {
    name: registerData?.name ? "" : "Ingresa tu nombre",
    lastName: registerData?.lastName ? "" : "Ingresa tu apellido",
    secondLastName: registerData?.secondLastName ? "" : "Ingresa tu segundo apellido",
    phone: registerData?.phone ? "" : "Ingresa tu teléfono",
    username: registerData?.username ? "" : "Ingresa tu nombre de usuario",
    email: registerData?.email ? "" : "Ingresa tu correo",
    password: !registerData?.password
      ? "Ingresa una contraseña"
      : registerData?.password.length < 6
      ? "Debe tener al menos 6 caracteres"
      : "",
    confirmPassword:
      registerData?.confirmPassword
        ? registerData?.password !== registerData?.confirmPassword
          ? "Las contraseñas no coinciden"
          : ""
        : "Confirma tu contraseña",
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2 className="register-title">Crear cuenta</h2>
      <p className="register-subtitle">Completa los campos para registrarte.</p>
      
      {message?.text && (
        <div className="register-message" role="status" aria-live="polite">
          {message.text}
        </div>
      )}

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
        />
      </div>
      {touched.name && errors.name && (
        <div className="error-message" role="alert">
          {errors.name}
        </div>
      )}

      <div className="grid-two">
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
          />
        </div>
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
          />
        </div>
      </div>

      <div className="grid-two">
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
          />
        </div>
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
          />
        </div>
      </div>

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
        />
      </div>
      {touched.email && errors.email && (
        <div className="error-message" role="alert">
          {errors.email}
        </div>
      )}

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
          />
          <button
            type="button"
            className="input-eye"
            onClick={onTogglePassword}
            disabled={loading}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {touched.password && errors.password && (
          <div className="error-message">
            {errors.password}
          </div>
        )}
      </div>

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
          />
          <button
            type="button"
            className="input-eye"
            onClick={onToggleConfirmPassword}
            disabled={loading}
            aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {touched.confirmPassword && errors.confirmPassword && (
          <div className="error-message">
            {errors.confirmPassword}
          </div>
        )}
      </div>

      <button 
        type="submit" 
        className="btn primary submit-btn" 
        disabled={loading}
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
export default RegisterForm;
