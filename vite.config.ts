import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dsv from '@rollup/plugin-dsv'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    dsv({
      processRow: (row, id) => {
        Object.keys(row).forEach((key) => {
          const value = row[key];
          let result: any;
          if (['FALSE', 'TRUE'].some(b => b === value)) {
            result = value === 'TRUE';
          } else {
            result = (isNaN(+value) ? value : +value);
          }
          row[key] = result;
        });
        return undefined;
      }
    })
  ],
})
