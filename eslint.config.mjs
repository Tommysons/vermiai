import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  // ✅ OUR OVERRIDES (SAFE PLACE)
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',

      // optional but useful for dev experience
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])
