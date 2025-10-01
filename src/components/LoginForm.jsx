import React from 'react'
import { Eye, EyeOff } from 'lucide-react'

function LoginForm({
  loginData,
  showPassword,
  loading,
  message,
  onChange,
  onSubmit,
  onTogglePassword,
  onSwitchToRegister,
}) {
  return (
    <form onSubmit={onSubmit}>
      <h2>Iniciar sesión</h2>
      <p>Ingresa tus credenciales para continuar.</p>
      {message?.text && (
        <div className="message-container">
          <div className="message-text">{message.text}</div>
        </div>
      )}

      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={loginData.email}
        onChange={onChange}
        required
      />

      <div style={{ position: 'relative' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Contraseña"
          value={loginData.password}
          onChange={onChange}
          required
        />
        <button
          type="button"
          className="input-eye"
          onClick={onTogglePassword}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <button type="submit" className="btn primary" disabled={loading}>
        {loading ? 'Entrando...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}

export default LoginForm
