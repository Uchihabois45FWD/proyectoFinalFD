import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
function RegisterForm({
  registerData = { name: "", lastName: "", secondLastName: "", phone: "", idNumber: "", email: "", password: "", confirmPassword: "" },
  showPassword = false,
  showConfirmPassword = false,
  loading = false,
  message = null,
  onChange = () => {},
  onSubmit = () => {},
  onTogglePassword = () => {},
  onToggleConfirmPassword = () => {},
  onSwitchToLogin = () => {},
}) {
  const [touched, setTouched] = useState({ name: false, lastName: false, secondLastName: false, phone: false, idNumber: false, email: false, password: false, confirmPassword: false });
  const errors = {
    name: registerData?.name ? "" : "Ingresa tu nombre",
    lastName: registerData?.lastName ? "" : "Ingresa tu apellido",
    secondLastName: registerData?.secondLastName ? "" : "Ingresa tu segundo apellido",
    phone: registerData?.phone ? "" : "Ingresa tu teléfono",
    idNumber: registerData?.idNumber ? "" : "Ingresa tu cédula",
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
    setTouched((t) => ({ ...t, [name]: true }));
  };
  return (
    <form onSubmit={onSubmit}>
      <h2>Crear cuenta</h2>
      <p style={{ color: '#666' }}>Completa los campos para registrarte.</p>
      {message?.text && (
        <div role="status" aria-live="polite" style={{ marginBottom: 10, color: '#b91c1c' }}>
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
        />
      </div>
      {touched.name && errors.name && (
        <div role="alert" style={{ color: '#b91c1c', marginTop: -8, marginBottom: 8 }}>{errors.name}</div>
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
          />
        </div>
        <div className="field">
          <label htmlFor="idNumber">Cédula</label>
          <input
            id="idNumber"
            type="text"
            name="idNumber"
            placeholder="Cédula"
            value={registerData?.idNumber || ""}
            onChange={onChange}
            onBlur={handleBlur}
            disabled={loading}
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
        />
      </div>
      {touched.email && errors.email && (
        <div role="alert" style={{ color: '#b91c1c', marginTop: -8, marginBottom: 8 }}>{errors.email}</div>
      )}

      <div className="field" style={{ position: 'relative', marginBottom: 8 }}>
        <label htmlFor="password">Contraseña</label>
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
        <div role="alert" style={{ color: '#b91c1c', marginTop: -8, marginBottom: 8 }}>{errors.password}</div>
      )}

      <div className="field" style={{ position: 'relative' }}>
        <label htmlFor="confirmPassword">Confirmar contraseña</label>
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
        />
        <button
          type="button"
          className="input-eye"
          onClick={onToggleConfirmPassword}
          disabled={loading}
          aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'}
          title={showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'}
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {touched.confirmPassword && errors.confirmPassword && (
        <div role="alert" style={{ color: '#b91c1c', marginTop: -8, marginBottom: 8 }}>{errors.confirmPassword}</div>
      )}

      <button type="submit" className="btn primary" disabled={loading}>
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <div style={{ marginTop: 12 }}>
        <button type="button" className="btn secondary" onClick={onSwitchToLogin} disabled={loading}>
          <ArrowLeft style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 6 }} />
          Iniciar sesión
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;
