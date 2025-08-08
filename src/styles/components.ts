import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8fafc;
    color: #1e293b;
    line-height: 1.6;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
};

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid ${colors.gray[200]};

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  text-align: center;
  white-space: nowrap;

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return `
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          gap: 0.375rem;
        `;
      case 'lg':
        return `
          padding: 0.875rem 1.5rem;
          font-size: 1rem;
          gap: 0.5rem;
        `;
      default:
        return `
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          gap: 0.5rem;
        `;
    }
  }}

  ${({ variant = 'primary', disabled }) => {
    if (disabled) {
      return `
        background-color: ${colors.gray[300]};
        color: ${colors.gray[500]};
        cursor: not-allowed;
      `;
    }

    switch (variant) {
      case 'secondary':
        return `
          background-color: ${colors.gray[100]};
          color: ${colors.gray[700]};
          border: 1px solid ${colors.gray[300]};
          
          &:hover {
            background-color: ${colors.gray[200]};
          }
        `;
      case 'danger':
        return `
          background-color: ${colors.error[500]};
          color: white;
          
          &:hover {
            background-color: ${colors.error[600]};
          }
        `;
      case 'success':
        return `
          background-color: ${colors.success[500]};
          color: white;
          
          &:hover {
            background-color: ${colors.success[600]};
          }
        `;
      default:
        return `
          background-color: ${colors.primary[500]};
          color: white;
          
          &:hover {
            background-color: ${colors.primary[600]};
          }
        `;
    }
  }}

  &:focus {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${({ error }) => error ? colors.error[500] : colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: ${colors.primary[500]};
    outline: 2px solid ${colors.primary[100]};
  }

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;

export const Select = styled.select<{ error?: boolean }>`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${({ error }) => error ? colors.error[500] : colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: ${colors.primary[500]};
    outline: 2px solid ${colors.primary[100]};
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.gray[700]};
  margin-bottom: 0.375rem;
`;

export const ErrorMessage = styled.span`
  display: block;
  font-size: 0.75rem;
  color: ${colors.error[500]};
  margin-top: 0.25rem;
`;

export const Badge = styled.span<{
  variant?: 'success' | 'warning' | 'error' | 'info';
}>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;

  ${({ variant = 'info' }) => {
    switch (variant) {
      case 'success':
        return `
          background-color: ${colors.success[100]};
          color: ${colors.success[700]};
        `;
      case 'warning':
        return `
          background-color: ${colors.warning[100]};
          color: ${colors.warning[700]};
        `;
      case 'error':
        return `
          background-color: ${colors.error[100]};
          color: ${colors.error[700]};
        `;
      default:
        return `
          background-color: ${colors.primary[100]};
          color: ${colors.primary[700]};
        `;
    }
  }}
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid ${colors.gray[300]};
  border-radius: 50%;
  border-top-color: ${colors.primary[500]};
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
